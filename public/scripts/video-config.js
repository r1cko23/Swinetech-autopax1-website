/**
 * Video Configuration
 * 
 * Centralized configuration for video file paths.
 * This allows easy switching between local files and Supabase CDN.
 * 
 * This file works with the supabase-config.js file to provide
 * video URLs from Supabase CDN when configured.
 */

(function() {
  'use strict';

  /**
   * Video file names (without path)
   * These should match the file names in your Supabase Storage bucket
   */
  const VIDEO_FILES = {
    BRAND_VIDEO: 'swintech BRAND VIDEO eng FINAL W SUBS.mp4',
    DEMO_VIDEO: 'demo video spray only VO engsubs FIOINAL.mp4'
  };

  /**
   * Get video URLs - uses Supabase CDN if configured, otherwise falls back to local paths
   */
  window.VideoConfig = {
    /**
     * Get brand video URL
     * @returns {Promise<string>} URL to the brand video
     */
    async getBrandVideo() {
      if (window.SupabaseVideoUrls) {
        return await window.SupabaseVideoUrls.getBrandVideo();
      }
      // Fallback to local path
      return `/${VIDEO_FILES.BRAND_VIDEO}`;
    },

    /**
     * Get demo video URL
     * @returns {Promise<string>} URL to the demo video
     */
    async getDemoVideo() {
      if (window.SupabaseVideoUrls) {
        return await window.SupabaseVideoUrls.getDemoVideo();
      }
      // Fallback to local path
      return `/${VIDEO_FILES.DEMO_VIDEO}`;
    },

    /**
     * Get video file names for reference
     */
    FILES: VIDEO_FILES
  };
})();
