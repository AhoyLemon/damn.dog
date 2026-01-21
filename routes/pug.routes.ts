/**
 * Pug Routing Configuration for DAMN DOG
 * =======================================
 * 
 * This file defines how Pug templates are compiled to HTML files.
 * It gives you complete control over your site's URL structure.
 * 
 * IMPORTANT: This is a build-time configuration file. It should NOT be deployed
 * to production as it's only used during development and build processes.
 * 
 * How It Works
 * ------------
 * Each route maps a source Pug file to an output HTML file:
 * 
 * 'pug/source.pug' => 'output.html'
 * 
 * Partial Files
 * -------------
 * Files starting with underscore (_) are automatically treated as partials
 * and do NOT need routes. They're meant to be included in other templates.
 * 
 * Examples: _head.pug, _footer.pug, _mixins.pug
 */

export interface RouteMap {
  [key: string]: string;
}

export const routes: RouteMap = {
  // Main pages
  "pug/index.pug": "index.html",
  "pug/offline.pug": "offline.html",
  "pug/privacy.pug": "privacy.html",
  "pug/sitemap.pug": "sitemap.xml",

  // Add more routes here as you create new pages
};

export default routes;
