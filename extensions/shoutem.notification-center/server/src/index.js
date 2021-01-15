// list of exports supported by shoutem can be found here: https://shoutem.github.io/docs/extensions/reference/extension-exports

// Constants `screens`, `actions` and `reducer` are exported via named export
// It is important to use those exact names
import { NotificationsPage, GroupsPage } from './pages';
import { shoutemUrls } from './services';
import './style.scss';

import { reducer } from './redux';

export const pages = {
  NotificationsPage,
  GroupsPage,
};

let pageReducer = null;

export function pageWillMount(page) {
  pageReducer = reducer();
  shoutemUrls.init(page);
}

export { pageReducer as reducer };
