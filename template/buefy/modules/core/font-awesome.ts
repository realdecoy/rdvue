import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowCircleDown,
  faArrowCircleUp,
  faArrowDown,
  faArrowUp,
  faCaretUp,
  faChartLine,
  faChartPie,
  faCheckCircle,
  faChevronDown,
  faChevronLeft,
  faChevronUp,
  faCoins,
  faEllipsisV,
  faEye,
  faEyeSlash,
  faLock,
  faPencilAlt,
  faSearch,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Vue from 'vue';

library.add(
  faArrowUp,
  faArrowDown,
  faArrowCircleUp,
  faArrowCircleDown,
  faChevronUp,
  faChevronDown,
  faChevronLeft,
  faCoins,
  faEllipsisV,
  faLock,
  faCheckCircle,
  faChartLine,
  faChartPie,
  faCaretUp,
  faPencilAlt,
  faTrashAlt,
  faSearch,
  faEye,
  faEyeSlash,
);

const FONT_AWESOME_COMPONENT = 'font-awesome-icon';

// Register FontAwesome component globally
Vue.component(FONT_AWESOME_COMPONENT,
  FontAwesomeIcon);

// tslint:disable-next-line:no-var-requires
const { default: config } = require('buefy/src/utils/config') as {
  default: {
    defaultIconComponent: string;
    defaultIconPack: string;
  };
};

// Force Buefy to use vue-fontawesome to render icons
config.defaultIconComponent = FONT_AWESOME_COMPONENT;
config.defaultIconPack = 'fas';
