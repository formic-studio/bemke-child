<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'wp_enqueue_scripts', 'bemke_child_enqueue_assets', 20 );

function bemke_child_enqueue_assets() {
	if ( function_exists( 'bricks_is_builder_main' ) && bricks_is_builder_main() ) {
		return;
	}

	$css_rel_path = '/dist/main.min.css';
	$js_rel_path  = '/dist/main.min.js';

	$css_abs_path = get_stylesheet_directory() . $css_rel_path;
	$js_abs_path  = get_stylesheet_directory() . $js_rel_path;

	if ( file_exists( $css_abs_path ) ) {
		wp_enqueue_style(
			'bemke-child-main',
			get_stylesheet_directory_uri() . $css_rel_path,
			array(),
			(string) filemtime( $css_abs_path )
		);
	}

	if ( file_exists( $js_abs_path ) ) {
		wp_enqueue_script(
			'bemke-child-main',
			get_stylesheet_directory_uri() . $js_rel_path,
			array(),
			(string) filemtime( $js_abs_path ),
			array(
				'in_footer' => true,
				'strategy'  => 'defer',
			)
		);
	}
}
