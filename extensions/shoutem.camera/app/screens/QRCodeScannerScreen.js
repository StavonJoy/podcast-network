import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import { NavigationBar } from 'shoutem.navigation';

import { connectStyle } from '@shoutem/theme';
import { Screen } from '@shoutem/ui';

import QRCodeScanner from '../components/QRCodeScanner.js';
import { ext } from '../const';

const { func, string } = PropTypes;

/**
 * A screen that lets a user scan a QR code
 */
class QRCodeScannerScreen extends PureComponent {
  static propTypes = {
    // Called when a QR code has been successfully scanned
    onQRCodeScanned: func,
    // Screen title
    title: string,
  }

  render() {
    const { onQRCodeScanned, title } = this.props;

    return (
      <Screen>
        <NavigationBar title={title.toUpperCase()} />
        <QRCodeScanner onQRCodeScanned={onQRCodeScanned} />
      </Screen>
    );
  }
}

export default connectStyle(ext('QRCodeScannerScreen'))(QRCodeScannerScreen);
