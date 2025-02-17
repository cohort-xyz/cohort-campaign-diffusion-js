import type { LocalizedString } from './localization';

export type CampaignConfig = {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  link: string;
  accentColor: string;
};

type BaseSDKConfig = {
  type: 'modal' | 'banner' | 'toast';
  typeConfig: unknown;
  campaign: CampaignConfig;
  whitelistedUrls: string[] | null;
};

type ModalSDKConfig = BaseSDKConfig & {
  type: 'modal';
  typeConfig: null;
};

export type BannerSDKConfig = BaseSDKConfig & {
  type: 'banner';
  typeConfig: {
    selector: string;
  };
};

export type ToastSDKConfig = BaseSDKConfig & {
  type: 'toast';
  typeConfig: {
    position: 'bottom-left' | 'bottom-right';
  };
};
export type SDKConfig = ModalSDKConfig | BannerSDKConfig | ToastSDKConfig;
export type RawSDKConfig = SDKConfig & {
  campaign: {
    name: LocalizedString;
    description: LocalizedString;
  };
};

abstract class CampaignEngagementVector {
  protected readonly campaignConfig: CampaignConfig;

  constructor(campaignConfig: CampaignConfig) {
    this.campaignConfig = campaignConfig;
  }

  abstract generateStyles(): HTMLStyleElement;

  abstract show(): void;

  abstract destroy(): void;
}

export { CampaignEngagementVector };

