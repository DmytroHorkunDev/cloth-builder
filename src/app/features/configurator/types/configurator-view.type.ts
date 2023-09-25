import { CONFIGURATOR_VIEW } from '../constants/configurator-views.constant';

export type TConfiguratorView = typeof CONFIGURATOR_VIEW[keyof typeof CONFIGURATOR_VIEW];
