import React from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { connect } from 'react-redux';

import { cloneStatus } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { GridRow, View } from '@shoutem/ui';

import { I18n } from 'shoutem.i18n';

import { ext, TRANSLATIONS } from '../const';

// Components
import {
  DealsScreen,
  mapStateToProps,
  mapDispatchToProps,
} from './DealsScreen';
import DealGridView from '../components/DealGridView';

export class DealsGridScreen extends DealsScreen {
  constructor(props, context) {
    super(props, context);

    autoBindReact(this);

    this.state = {
      ...this.state,
      renderCategoriesInline: true,
    };
  }

  getNavBarProps() {
    const titleStyle = _.get(this.props, 'style.titleContainer', {});
    return super.getNavBarProps(I18n.t(TRANSLATIONS.DEALS_GRID_BUTTON), titleStyle);
  }

  renderRow(deals, sectionId, dealId) {
    const { hasFeaturedItem } = this.props;

    if (hasFeaturedItem && dealId === '0') {
      return this.renderFeaturedDeal(deals[0]);
    }

    const dealsViews = _.map(deals, deal => (
      <DealGridView
        key={deal.id}
        deal={deal}
        onPress={this.handleOpenDealDetails}
      />
    ));

    return (
      <View styleName="flexible sm-gutter-bottom sm-gutter-left">
        <GridRow columns={2}>
          {dealsViews}
        </GridRow>
      </View>
    );
  }

  renderData(deals) {
    const { renderMap } = this.state;
    if (renderMap) {
      return this.renderMap();
    }

    if (_.isEmpty(deals)) {
      return super.renderData(deals);
    }

    const { hasFeaturedItem } = this.props;

    let listData = [...deals];
    let featuredDeal = null;

    if (hasFeaturedItem) {
      featuredDeal = listData.splice(0, 1);
    }

    const groupedDeals = GridRow.groupByRows(listData, 2);

    if (featuredDeal) {
      listData = [featuredDeal, ...groupedDeals];
    } else {
      listData = groupedDeals;
    }
    cloneStatus(deals, listData);

    return super.renderData(listData);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('DealsGridScreen', {}))(DealsGridScreen),
);
