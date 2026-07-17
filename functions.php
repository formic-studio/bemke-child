<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once get_stylesheet_directory() . '/inc/linkedin-posts.php';
require_once get_stylesheet_directory() . '/inc/instagram-feed.php';
require_once get_stylesheet_directory() . '/inc/getresponse.php';

add_action( 'wp_head', 'bemke_child_print_motion_preference', 1 );
add_action( 'wp_enqueue_scripts', 'bemke_child_enqueue_assets', 20 );

function bemke_child_print_motion_preference() {
	if ( bemke_child_is_bricks_builder_request() ) {
		return;
	}
	?>
	<script id="bemke-motion-preference">
		(function () {
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
