import { LinkedinIcon, FacebookIcon, XIcon, RedditIcon, WhatsappIcon } from 'react-share';
import React from 'react';

type SocialMedia = {
  name: string;
  icon: React.ComponentType<any>;
};

export const socialMediaArray: SocialMedia[] = [
  { name: 'facebook', icon: FacebookIcon },
  { name: 'linkedin', icon: LinkedinIcon },
  { name: 'x', icon: XIcon },
  { name: 'reddit', icon: RedditIcon },
  { name: 'whatsapp', icon: WhatsappIcon },
];
