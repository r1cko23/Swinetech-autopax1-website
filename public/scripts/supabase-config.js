/**
 * Supabase Configuration
 * 
 * This file contains the Supabase client configuration for accessing
 * Supabase Storage (CDN) for video files.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Get your Supabase URL and anon key from your Supabase project dashboard
 * 2. Set them in window.SUPABASE_CONFIG before this script loads, or
 * 3. Update the SUPABASE_URL and SUPABASE_ANON_KEY constants below
 * 
 * Example:
 * <script>
 *   window.SUPABASE_CONFIG = {
 *     url: 'https://your-project.supabase.co',
 *     anonKey: 'your-anon-key'
 *   };
 * </script>
 * <script src="scripts/supabase-config.js"></script>
 */

(function() {
  'use strict';

  // Storage bucket name for videos
  const VIDEO_BUCKET = 'videos';

  // Get Supabase credentials from window config or use constants
  // Your Supabase credentials are configured below
  const SUPABASE_URL = 
    (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url) || 
    'https://kkdbbymvxwmmywtniaje.supabase.co';

  const SUPABASE_ANON_KEY = 
    (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.anonKey) || 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrZGJieW12eHdtbXl3dG5pYWplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTYwNzgsImV4cCI6MjA4NDQ3MjA3OH0.-zrJmAZ7uPZWJvPoHM6rq5MfpHH87tGAU0MrkLFWE-Y';

  // Supabase client instance
  let supabaseClient = null;

  /**
   * Initialize Supabase client
   */
  async function initSupabase() {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.warn('Supabase credentials not configured. Videos will use local paths.');
      return null;
    }

    if (supabaseClient) {
      return supabaseClient;
    }

    try {
      // Try to use the npm package if available (loaded via script tag or module)
      let createClient;
      
      if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
        // Supabase loaded via CDN or global
        createClient = window.supabase.createClient;
      } else {
        // Try to use the npm package
        const supabaseModule = await import('@supabase/supabase-js');
        createClient = supabaseModule.createClient;
      }
      
      supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      return supabaseClient;
    } catch (error) {
      console.warn('Supabase client could not be initialized:', error);
      console.warn('Make sure @supabase/supabase-js is installed or loaded via CDN');
      return null;
    }
  }

  /**
   * Get public URL for a video file from Supabase Storage
   * @param {string} videoPath - Path to the video file in the storage bucket
   * @returns {Promise<string>} Public CDN URL for the video
   */
  async function getVideoUrl(videoPath) {
    const client = await initSupabase();
    
    if (!client) {
      // Fallback to local path if Supabase is not configured
      return videoPath.startsWith('/') ? videoPath : `/${videoPath}`;
    }

    try {
      const { data } = client
        .storage
        .from(VIDEO_BUCKET)
        .getPublicUrl(videoPath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error getting video URL from Supabase:', error);
      // Fallback to local path
      return videoPath.startsWith('/') ? videoPath : `/${videoPath}`;
    }
  }

  /**
   * Get video URL synchronously (returns promise)
   * Use this for async/await or .then() patterns
   */
  window.getSupabaseVideoUrl = getVideoUrl;

  /**
   * Video URLs object with cached values
   */
  window.SupabaseVideoUrls = {
    _cache: {},
    
    /**
     * Get brand video URL
     */
    async getBrandVideo() {
      const cacheKey = 'brand';
      if (this._cache[cacheKey]) {
        return this._cache[cacheKey];
      }
      const url = await getVideoUrl('swintech BRAND VIDEO eng FINAL W SUBS.mp4');
      this._cache[cacheKey] = url;
      return url;
    },
    
    /**
     * Get demo video URL
     */
    async getDemoVideo() {
      const cacheKey = 'demo';
      if (this._cache[cacheKey]) {
        return this._cache[cacheKey];
      }
      const url = await getVideoUrl('demo video spray only VO engsubs FIOINAL.mp4');
      this._cache[cacheKey] = url;
      return url;
    }
  };

  // Auto-initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupabase);
  } else {
    initSupabase();
  }
})();
