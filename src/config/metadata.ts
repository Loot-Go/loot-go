import type { Metadata, Viewport } from "next";

const APP_NAME = "LootGo";
const APP_DEFAULT_TITLE = "LootGo";
const APP_TITLE_TEMPLATE = "%s - LootGo";
const APP_DESCRIPTION = "LootGo : Turn your daily life into a treasure hunt!";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  icons: {
    apple: "/assets/icons/apple-touch-icon.png",
    shortcut: {
      sizes: "48x48",
      url: "/assets/icons/favicon.ico",
      type: "image/x-icon",
    },
    other: [
      { rel: "icon", sizes: "96x96", url: "/assets/icons/favicon-96x96.png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#000000",
};
