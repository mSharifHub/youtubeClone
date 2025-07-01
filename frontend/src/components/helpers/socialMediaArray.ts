import {
  LinkedinIcon,
  FacebookIcon,
  XIcon,
  WhatsappIcon,
  LinkedinShareButton,
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share';
import React from 'react';

type SocialMedia = {
  name: string;
  icon: React.ComponentType<any>;
  shareButton: React.ComponentType<any>;
};

export const socialMediaArray: SocialMedia[] = [
  { name: 'facebook', icon: FacebookIcon, shareButton: FacebookShareButton },
  { name: 'linkedin', icon: LinkedinIcon, shareButton: LinkedinShareButton },
  { name: 'x', icon: XIcon, shareButton: TwitterShareButton },
  { name: 'whatsapp', shareButton: WhatsappShareButton, icon: WhatsappIcon },
];
