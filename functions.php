<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once get_stylesheet_directory() . '/inc/linkedin-posts.php';
require_once get_stylesheet_directory() . '/inc/instagram-feed.php';
require_once get_stylesheet_directory() . '/inc/getresponse.php';
require_once get_stylesheet_directory() . '/inc/donor-stats.php';

add_action( 'wp_head', 'bemke_child_print_motion_preference', 1 );
add_action( 'wp_head', 'bemke_child_preload_critical_fonts', 2 );
add_action( 'wp_enqueue_scripts', 'bemke_child_enqueue_assets', 20 );
add_action( 'template_redirect', 'bemke_child_start_frontend_optimization_buffer', 0 );
add_filter( 'wp_get_attachment_image_attributes', 'bemke_child_optimize_below_fold_images', 100, 3 );

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
		'SeasonSans-Regular.woff2',
		'SeasonSans-Medium.woff2',
	);

	foreach ( $fonts as $font ) {
		?>
		<link rel="preload" href="<?php echo esc_url( $font_url . $font ); ?>" as="font" type="font/woff2" crossorigin>
		<?php
	}
}

function bemke_child_enqueue_assets() {
	$css_rel_path = '/dist/main.min.css';
	$js_rel_path  = '/dist/main.min.js';

	$css_abs_path = get_stylesheet_directory() . $css_rel_path;
	$js_abs_path  = get_stylesheet_directory() . $js_rel_path;
	$is_builder   = bemke_child_is_bricks_builder_request();

	if ( file_exists( $css_abs_path ) ) {
		wp_enqueue_style(
			'bemke-child-main',
			get_stylesheet_directory_uri() . $css_rel_path,
			array(),
			filemtime( $css_abs_path )
		);

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
	$html = str_replace(
		array(
			'font-family:"Season Sans";font-weight:400;font-display:swap;',
			'font-family:"Season Sans";font-weight:500;font-display:swap;',
		),
		array(
			'font-family:"Season Sans";font-weight:400;font-display:block;',
			'font-family:"Season Sans";font-weight:500;font-display:block;',
		),
		$html
	);

	if ( false === stripos( $html, 'Ksztaltuj-przyszlosc-edukacji.mp4' ) ) {
		return $html;
	}

	return preg_replace_callback(
		'/<video\b(?=[^>]*Ksztaltuj-przyszlosc-edukacji\.mp4)[^>]*>/i',
		function ( $matches ) {
			$tag = preg_replace_callback(
				'/\ssrc\s*=\s*(["\'])([^"\']*Ksztaltuj-przyszlosc-edukacji\.mp4[^"\']*)\1/i',
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

			return $tag;
		},
		$html
	);
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
