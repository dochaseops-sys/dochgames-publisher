import { InstallationPlatform } from '../types';

export interface PlatformInstructionMeta {
  platform: InstallationPlatform;
  id: InstallationPlatform;
  name: string;
  badge?: string;
  shortDescription: string;
  steps: Array<string>;
  detailedSteps?: Array<{
    title: string;
    description: string;
    tip?: string;
  }>;
  recommendedPlacement?: string;
  commonIssues?: Array<{
    issue: string;
    solution: string;
  }>;
}

export const PLATFORM_INSTRUCTIONS: PlatformInstructionMeta[] = [
  {
    platform: 'wordpress',
    id: 'wordpress',
    name: 'WordPress',
    shortDescription: 'Install using a standard Custom HTML block in Gutenberg or Classic Editor.',
    recommendedPlacement: 'Inside a Custom HTML block at the top or middle of your article template.',
    steps: [
      'Log into your WordPress admin dashboard and edit the target page or template.',
      'Click the "+" button to add a new block and search for "Custom HTML".',
      'Paste your copied DochGames embed code snippet directly into the block.',
      'Click "Update" or "Publish" at the top right of your WordPress editor.'
    ],
    commonIssues: [
      {
        issue: 'Widget not showing in Preview mode',
        solution: 'Some caching and security plugins block script execution inside draft previews. View the published page in an incognito window.'
      }
    ]
  },
  {
    platform: 'shopify',
    id: 'shopify',
    name: 'Shopify',
    shortDescription: 'Add to any Shopify store theme using a Custom Liquid section or block.',
    recommendedPlacement: 'In a Custom Liquid section on your homepage or product detail template.',
    steps: [
      'In your Shopify admin, go to Online Store → Themes and click "Customise".',
      'Click "Add section" (or "Add block") and choose "Custom Liquid".',
      'Paste the DochGames embed code snippet into the Custom Liquid code box.',
      'Click "Save" at the top right of the Shopify editor.'
    ]
  },
  {
    platform: 'webflow',
    id: 'webflow',
    name: 'Webflow',
    shortDescription: 'Insert an Embed component anywhere inside your Webflow page layout.',
    recommendedPlacement: 'Inside a container element above or beside your primary content section.',
    steps: [
      'Open your Webflow Designer and select the target page.',
      'Press "A" to open Add Elements, scroll down to Advanced, and drag an "Embed" element.',
      'Paste the DochGames code snippet into the HTML Embed Code Editor.',
      'Click "Save & Close" and publish your changes to your custom domain.'
    ]
  },
  {
    platform: 'wix',
    id: 'wix',
    name: 'Wix',
    shortDescription: 'Embed the widget container using an HTML Embed element in Wix Studio or Editor.',
    recommendedPlacement: 'In an Embed HTML block stretched to full width within your page grid.',
    steps: [
      'Open your site in Wix Editor or Wix Studio.',
      'Click "+" to add elements, select "Embed Code", and click "Embed HTML".',
      'Paste the code snippet into the code box and click "Apply".',
      'Resize the element container to your preferred width and click "Publish".'
    ]
  },
  {
    platform: 'react',
    id: 'react',
    name: 'React / Next.js',
    badge: 'Modern JSX',
    shortDescription: 'Install using a typed, client-side safe React component with Next.js App Router support.',
    recommendedPlacement: 'Within your main layout component or individual page template.',
    steps: [
      'Create a DochGamesWidget component file in your components folder.',
      'Paste the provided React component code snippet.',
      'Import <DochGamesWidget /> into your target page or view.',
      'Deploy your build to production or staging.'
    ]
  },
  {
    platform: 'other',
    id: 'other',
    name: 'Other website / Custom HTML',
    shortDescription: 'Standard asynchronous HTML script tag and container div for any website or CMS.',
    recommendedPlacement: 'Inside your content container or directly before the closing </body> tag.',
    steps: [
      'Open your website HTML template or CMS editor.',
      'Place the container <div> where the game widget should render.',
      'Paste the <script> loader tag right below the container or before </body>.',
      'Save and publish your page.'
    ]
  }
];

export function getPlatformInstructions(platform: InstallationPlatform): {
  name: string;
  steps: string[];
  recommendedPlacement?: string;
} {
  const match = PLATFORM_INSTRUCTIONS.find(p => p.platform === platform) || PLATFORM_INSTRUCTIONS[5];
  return {
    name: match.name,
    steps: match.steps,
    recommendedPlacement: match.recommendedPlacement
  };
}
