import Banner from './banner';
import Modal from './modal';
import Toast from './toast';
import type {CampaignEngagementVector, SDKConfig} from './utils';

export default function campaignEngagementFactory(
  config: SDKConfig,
  verbose = false,
): CampaignEngagementVector {
  switch (config.type) {
    case 'modal':
      return new Modal(config.campaign);
    case 'banner':
      return new Banner(config.campaign, config.typeConfig, verbose);
    case 'toast':
      return new Toast(config.campaign, config.typeConfig);
    default:
      // @ts-expect-error - type doesn't ensure the value
      throw new Error(`Unsupported format: ${config.format}`);
  }
}
