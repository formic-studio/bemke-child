<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once get_stylesheet_directory() . '/inc/linkedin-posts.php';
require_once get_stylesheet_directory() . '/inc/instagram-feed.php';
require_once get_stylesheet_directory() . '/inc/getresponse.php';
require_once get_stylesheet_directory() . '/inc/donor-stats.php';
require_once get_stylesheet_directory() . '/inc/donor-video.php';
require_once get_stylesheet_directory() . '/inc/foundation-documents.php';
require_once get_stylesheet_directory() . '/inc/founders-campaign.php';
require_once get_stylesheet_directory() . '/inc/admin-slider-menu.php';
require_once get_stylesheet_directory() . '/inc/slider-galleries.php';
require_once get_stylesheet_directory() . '/inc/image-optimization.php';

add_action( 'wp_head', 'bemke_child_print_theme_color', 0 );
add_action( 'wp_head', 'bemke_child_print_motion_preference', 1 );
add_action( 'wp_head', 'bemke_child_preload_critical_fonts', 2 );
add_action( 'wp_enqueue_scripts', 'bemke_child_enqueue_assets', 20 );
add_action( 'template_redirect', 'bemke_child_start_frontend_optimization_buffer', 0 );
add_filter( 'wp_get_attachment_image_attributes', 'bemke_child_optimize_below_fold_images', 100, 3 );
add_filter( 'nav_menu_item_title', 'bemke_child_normalize_nav_menu_item_title' );

/**
 * Replace Unicode line/paragraph separators pasted into menu labels.
 *
 * Safari on iOS can render these separators without any visible spacing.
 */
function bemke_child_normalize_nav_menu_item_title( $title ) {
	$normalized_title = preg_replace( '/[\x{2028}\x{2029}]+/u', ' ', $title );

	return null === $normalized_title ? $title : $normalized_title;
}

function bemke_child_print_theme_color() {
	if ( bemke_child_is_bricks_builder_request() ) {
		return;
	}
	?>
	<meta name="theme-color" content="#f9bb59">
	<?php
}

function bemke_child_print_motion_preference() {
	if ( bemke_child_is_bricks_builder_request() ) {
		return;
	}
	?>
	<script id="bemke-motion-preference">
		(function () {
			document.documentElement.setAttribute('data-bemke-frontend', 'true');

			var reduced = window.matchMedia &&
				window.matchMedia('(prefers-reduced-motion: reduce)').matches;

			try {
				reduced =
					window.localStorage.getItem('bemke_a11y_reduce_motion') === 'true' ||
					reduced;
			} catch (error) {
				// The system preference still applies when storage is unavailable.
			}

			if (reduced) {
				document.documentElement.setAttribute('data-bemke-reduced-motion', 'true');
			} else {
				document.documentElement.removeAttribute('data-bemke-reduced-motion');
			}
		})();
	</script>
	<?php
}

function bemke_child_preload_critical_fonts() {
	if ( bemke_child_is_bricks_builder_request() ) {
		return;
	}

	$uploads  = wp_get_upload_dir();
	$font_url = trailingslashit( $uploads['baseurl'] ) . '2026/05/';
	$fonts    = array(
		'SeasonMix-RegularItalic.woff2',
		'SeasonSans-Regular.woff2',
	);

	foreach ( $fonts as $font ) {
		?>
		<link rel="preload" href="<?php echo esc_url( $font_url . $font ); ?>" as="font" type="font/woff2" crossorigin>
		<?php
	}
}

function bemke_child_enqueue_assets() {
	$css_rel_path             = '/dist/main.min.css';
	$js_rel_path              = '/dist/main.min.js';
	$campaign_ios_img_rel_path = '/src/media/campaign-book-ios.png';

	$css_abs_path              = get_stylesheet_directory() . $css_rel_path;
	$js_abs_path               = get_stylesheet_directory() . $js_rel_path;
	$campaign_ios_img_abs_path = get_stylesheet_directory() . $campaign_ios_img_rel_path;
	$is_builder                = bemke_child_is_bricks_builder_request();

	if ( file_exists( $css_abs_path ) ) {
		wp_enqueue_style(
			'bemke-child-main',
			get_stylesheet_directory_uri() . $css_rel_path,
			array(),
			filemtime( $css_abs_path )
		);

		if ( file_exists( $campaign_ios_img_abs_path ) ) {
			$campaign_ios_img_url = add_query_arg(
				'ver',
				filemtime( $campaign_ios_img_abs_path ),
				get_stylesheet_directory_uri() . $campaign_ios_img_rel_path
			);

			wp_add_inline_style(
				'bemke-child-main',
				':root{--bemke-campaign-book-ios:url(' . wp_json_encode( $campaign_ios_img_url ) . ');}'
			);
		}

		if ( $is_builder ) {
			wp_add_inline_style(
				'bemke-child-main',
				'@media (max-width: 991px) { #brx-header #brxe-vhhhdt > .bricks-mobile-menu-wrapper, #brx-header #brxe-vhhhdt > .bricks-mobile-menu-overlay { display: none !important; } }'
			);
		}
	}

	if ( ! $is_builder && file_exists( $js_abs_path ) ) {
		wp_enqueue_script(
			'bemke-child-main',
			get_stylesheet_directory_uri() . $js_rel_path,
			array(),
			filemtime( $js_abs_path ),
			true
		);

		if ( function_exists( 'wp_script_add_data' ) ) {
			wp_script_add_data( 'bemke-child-main', 'defer', true );
		}
	}
}

function bemke_child_start_frontend_optimization_buffer() {
	if (
		is_admin() ||
		wp_doing_ajax() ||
		( defined( 'REST_REQUEST' ) && REST_REQUEST ) ||
		is_feed() ||
		bemke_child_is_bricks_builder_request()
	) {
		return;
	}

	ob_start( 'bemke_child_optimize_frontend_markup' );
}

function bemke_child_optimize_frontend_markup( $html ) {
	$optimized_html = preg_replace(
		'/background-image\s*:\s*url\([^)]*FotoFullScreen-scaled\.webp[^)]*\)\s*;?/i',
		'',
		$html
	);

	if ( null !== $optimized_html ) {
		$html = $optimized_html;
	}

	if ( is_page( 'fundacja-campus-bemke' ) ) {
		$responsive_cta = '<span class="bemke-responsive-label bemke-responsive-label--desktop">Sprawdź możliwości rozwoju</span><span class="bemke-responsive-label bemke-responsive-label--mobile">Możliwości rozwoju</span>';
		$updated_html   = preg_replace(
			'/(?<=>)Sprawdź możliwości rozwoju(?=<\/a>)/u',
			$responsive_cta,
			$html,
			1
		);

		if ( null !== $updated_html ) {
			$html = $updated_html;
		}
	}

	$priority_video_pattern = '/<video\b(?=[^>]*Ksztaltuj-przyszlosc-edukacji\.(?:mp4|webm))[^>]*>/i';

	if ( ! preg_match( $priority_video_pattern, $html, $priority_video_match ) ) {
		return $html;
	}

	$poster_url = '';

	if (
		preg_match(
			'/\sposter\s*=\s*(["\'])([^"\']+)\1/i',
			$priority_video_match[0],
			$poster_match
		)
	) {
		$poster_url = $poster_match[2];
	}

	$html = preg_replace_callback(
		$priority_video_pattern,
		function ( $matches ) {
			$tag = preg_replace_callback(
				'/\ssrc\s*=\s*(["\'])([^"\']*Ksztaltuj-przyszlosc-edukacji\.(?:mp4|webm)[^"\']*)\1/i',
				function ( $source_matches ) {
					return ' data-bemke-src="' . esc_url( $source_matches[2] ) . '"';
				},
				$matches[0],
				1
			);

			$tag = preg_replace(
				'/\s+autoplay(?:\s*=\s*(?:"[^"]*"|\'[^\']*\'|[^\s>]+))?/i',
				'',
				$tag
			);

			if ( preg_match( '/\s+preload\s*=/i', $tag ) ) {
				$tag = preg_replace(
					'/\s+preload\s*=\s*(?:"[^"]*"|\'[^\']*\'|[^\s>]+)/i',
					' preload="none"',
					$tag,
					1
				);
			} else {
				$tag = preg_replace( '/>$/', ' preload="none">', $tag );
			}

			if ( false === stripos( $tag, 'data-bemke-autoplay=' ) ) {
				$tag = preg_replace( '/>$/', ' data-bemke-autoplay="true">', $tag );
			}

			if ( false === stripos( $tag, 'data-bemke-priority=' ) ) {
				$tag = preg_replace( '/>$/', ' data-bemke-priority="high">', $tag );
			}

			return $tag;
		},
		$html
	);

	if (
		$poster_url &&
		false === strpos( $html, 'href="' . esc_url( $poster_url ) . '"' )
	) {
		$poster_preload = sprintf(
			'<link rel="preload" href="%s" as="image" fetchpriority="high">',
			esc_url( $poster_url )
		);

		$html = preg_replace(
			'/<\/head>/i',
			$poster_preload . "\n</head>",
			$html,
			1
		);
	}

	return $html;
}

function bemke_child_optimize_below_fold_images( $attr, $attachment, $size ) {
	if ( empty( $attr['class'] ) ) {
		return $attr;
	}

	$classes        = preg_split( '/\s+/', trim( $attr['class'] ) );
	$target_classes = array( 'slider-img', 'sticky', 'img-scroll-expand' );

	if ( ! array_intersect( $target_classes, $classes ) ) {
		return $attr;
	}

	$attr['loading']       = 'lazy';
	$attr['decoding']      = 'async';
	$attr['fetchpriority'] = 'low';

	return $attr;
}

function bemke_child_is_bricks_builder_request() {
	if ( function_exists( 'bricks_is_builder_main' ) && bricks_is_builder_main() ) {
		return true;
	}

	if ( function_exists( 'bricks_is_builder' ) && bricks_is_builder() ) {
		return true;
	}

	if ( ! isset( $_GET['bricks'] ) ) {
		return false;
	}

	$bricks_mode = sanitize_key( wp_unslash( $_GET['bricks'] ) );

	return in_array( $bricks_mode, array( 'run', 'builder' ), true );
}
