import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { LayoutAnimation } from 'react-native';
import _ from 'lodash';

import { View, EmptyStateView } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';

import { MapView } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';

import { ext } from '../const';
import PlaceIconView from './PlaceIconView';
import { placeShape } from './shapes';

const createMarker = (place) => {
  if (!place) {
    return undefined;
  }

  const { location = {} } = place;
  const { latitude, longitude } = location;

  if (latitude && longitude) {
    return {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      placeId: place.id,
    };
  }
  return undefined;
};

const createMarkersFromPlaces = places => _.reduce(places, (result, place) => {
  const marker = createMarker(place);

  if (marker) {
    result.push(marker);
  }
  return result;
}, []);

export class MapList extends PureComponent {

  constructor(props) {
    super(props);

    this.renderImageRow = this.renderImageRow.bind(this);
    this.findSelectedPlace = this.findSelectedPlace.bind(this);
    this.setSelectedMarker = this.setSelectedMarker.bind(this);

    const { selectedPlace } = this.props;

    this.state = {
      ...this.state,
      schema: ext('places'),
      selectedMarker: createMarker(selectedPlace),
    };
  }

  componentDidMount() {
    const { places } = this.props;

    const markers = createMarkersFromPlaces(places);
    const region = _.isEmpty(markers) ? undefined : this.resolveInitialRegion(markers);

    LayoutAnimation.easeInEaseOut();
    this.setState({ markers, region });
  }

  static getDerivedStateFromProps(props, state) {
    if (places === state.places) {
      return state;
    }

    const { places } = props;
    const { selectedMarker } = state;

    const markedPlace = findSelectedPlace(places, selectedMarker);
    const markers = createMarkersFromPlaces(places);

    LayoutAnimation.easeInEaseOut();
    return {
      markers,
      places,
      selectedMarker: markedPlace ? selectedMarker : undefined,
    };
  }

  setSelectedMarker(selectedMarker) {
    LayoutAnimation.easeInEaseOut();
    this.setState({ selectedMarker });
  }

  resolveInitialRegion(markers) {
    const { initialRegion } = this.props;

    const defaultRegion = {
      ..._.first(markers),
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    return initialRegion || defaultRegion;
  }

  findSelectedPlace(places) {
    const { selectedMarker } = this.state;

    if (!selectedMarker) {
      return null;
    }
    const selectedPlace = places.find(place => place.id === selectedMarker.placeId);

    return selectedPlace;
  }

  renderImageRow() {
    const { cardStatesByLocation, places } = this.props;

    const returnedPlace = this.findSelectedPlace(places);
    const { id } = returnedPlace;


    const points = _.has(returnedPlace, 'points') ?
      returnedPlace.points : _.get(cardStatesByLocation[id], 'points');

    return (
      <PlaceIconView
        place={returnedPlace}
        points={points}
      />
    );
  }

  render() {
    const { selectedMarker, markers, region } = this.state;
    const printImageRow = (selectedMarker) ? this.renderImageRow() : null;

    if (_.isEmpty(markers)) {
      return (
        <EmptyStateView
          icon="address-full"
          message={I18n.t('shoutem.cms.noLocationsProvidedErrorMessage')}
        />
      );
    }

    return (
      <View styleName="flexible">
        <View styleName="flexible">
          <MapView
            markers={markers}
            onMarkerPressed={this.setSelectedMarker}
            region={region}
            selectedMarker={selectedMarker}
          />
        </View>
        {printImageRow}
      </View>
    );
  }
}

export default connectStyle(ext('MapList'))(MapList);

const { arrayOf, number, object, shape } = PropTypes;

MapList.propTypes = {
  // A dictionary of card states with location as the key
  cardStatesByLocation: object,
  places: arrayOf(placeShape).isRequired,
  selectedPlace: placeShape,
  initialRegion: shape({
    latitudeDelta: number,
    longitudeDelta: number,
  }),
};

MapList.defaultProps = {
  selectedPlace: undefined,
  initialRegion: undefined,
};
