<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'wp_enqueue_scripts', 'bemke_child_enqueue_assets', 20 );
add_filter( 'script_loader_tag', 'bemke_child_mark_scripts_as_module', 10, 3 );

/**
 * Load JS/CSS either from Vite dev server or from production build manifest.
 */
function bemke_child_enqueue_assets() {
	if ( function_exists( 'bricks_is_builder_main' ) && bricks_is_builder_main() ) {
		return;
	}

	if ( bemke_child_use_vite_dev_server() ) {
		bemke_child_enqueue_vite_dev_assets();
		return;
	}

	bemke_child_enqueue_built_assets();
}

/**
 * Enable this in local env via:
 * define( 'BEMKE_VITE_DEV_SERVER', true );
 * define( 'BEMKE_VITE_DEV_SERVER_URL', 'http://127.0.0.1:5173' );
 */
function bemke_child_use_vite_dev_server() {
	return defined( 'BEMKE_VITE_DEV_SERVER' ) && BEMKE_VITE_DEV_SERVER;
}

function bemke_child_get_vite_dev_server_url() {
	$default_url = 'http://127.0.0.1:5173';

	if ( defined( 'BEMKE_VITE_DEV_SERVER_URL' ) && is_string( BEMKE_VITE_DEV_SERVER_URL ) && BEMKE_VITE_DEV_SERVER_URL ) {
		return rtrim( BEMKE_VITE_DEV_SERVER_URL, '/' );
	}

	return $default_url;
}

function bemke_child_enqueue_vite_dev_assets() {
	$dev_server = bemke_child_get_vite_dev_server_url();

	wp_enqueue_script(
		'bemke-child-vite-client',
		$dev_server . '/@vite/client',
		array(),
		null,
		array( 'in_footer' => true )
	);

	wp_enqueue_script(
		'bemke-child-main',
		$dev_server . '/src/js/main.js',
		array( 'bemke-child-vite-client' ),
		null,
		array( 'in_footer' => true )
	);
}

function bemke_child_enqueue_built_assets() {
	$manifest_path = get_stylesheet_directory() . '/assets/dist/manifest.json';
	if ( ! file_exists( $manifest_path ) ) {
		return;
	}

	$manifest_json = file_get_contents( $manifest_path );
	if ( ! $manifest_json ) {
		return;
	}

	$manifest = json_decode( $manifest_json, true );
	if ( ! is_array( $manifest ) ) {
		return;
	}

	$entry_data = bemke_child_get_entry_from_manifest( $manifest, 'src/js/main.js' );
	if ( ! $entry_data ) {
		return;
	}

	$entry_key = $entry_data['key'];
	$entry     = $entry_data['chunk'];

	if ( empty( $entry['file'] ) ) {
		return;
	}

	$base_uri = get_stylesheet_directory_uri() . '/assets/dist';

	$css_files = bemke_child_collect_css_files_for_entry( $manifest, $entry_key );
	foreach ( $css_files as $css_file ) {
		wp_enqueue_style(
			'bemke-child-css-' . md5( $css_file ),
			$base_uri . '/' . ltrim( $css_file, '/' ),
			array(),
			null
		);
	}

	wp_enqueue_script(
		'bemke-child-main',
		$base_uri . '/' . ltrim( $entry['file'], '/' ),
		array(),
		null,
		array( 'in_footer' => true )
	);
}

function bemke_child_get_entry_from_manifest( array $manifest, $src_path ) {
	if ( isset( $manifest[ $src_path ] ) ) {
		return array(
			'key'   => $src_path,
			'chunk' => $manifest[ $src_path ],
		);
	}

	foreach ( $manifest as $key => $chunk ) {
		if ( ! is_array( $chunk ) ) {
			continue;
		}

		if ( isset( $chunk['src'] ) && $chunk['src'] === $src_path ) {
			return array(
				'key'   => $key,
				'chunk' => $chunk,
			);
		}
	}

	foreach ( $manifest as $key => $chunk ) {
		if ( is_array( $chunk ) && ! empty( $chunk['isEntry'] ) ) {
			return array(
				'key'   => $key,
				'chunk' => $chunk,
			);
		}
	}

	return null;
}

function bemke_child_collect_css_files_for_entry( array $manifest, $entry_key ) {
	$result  = array();
	$visited = array();

	bemke_child_collect_css_files_recursive( $manifest, $entry_key, $result, $visited );

	return array_values( array_unique( $result ) );
}

function bemke_child_collect_css_files_recursive( array $manifest, $chunk_key, array &$result, array &$visited ) {
	if ( isset( $visited[ $chunk_key ] ) ) {
		return;
	}

	$visited[ $chunk_key ] = true;

	if ( empty( $manifest[ $chunk_key ] ) || ! is_array( $manifest[ $chunk_key ] ) ) {
		return;
	}

	$chunk = $manifest[ $chunk_key ];

	if ( ! empty( $chunk['css'] ) && is_array( $chunk['css'] ) ) {
		foreach ( $chunk['css'] as $css_file ) {
			$result[] = $css_file;
		}
	}

	if ( ! empty( $chunk['imports'] ) && is_array( $chunk['imports'] ) ) {
		foreach ( $chunk['imports'] as $import_key ) {
			bemke_child_collect_css_files_recursive( $manifest, $import_key, $result, $visited );
		}
	}
}

/**
 * Force module type for entry script and Vite client script.
 */
function bemke_child_mark_scripts_as_module( $tag, $handle, $src ) {
	$module_handles = array(
		'bemke-child-main',
		'bemke-child-vite-client',
	);

	if ( ! in_array( $handle, $module_handles, true ) ) {
		return $tag;
	}

	return '<script type="module" src="' . esc_url( $src ) . '" id="' . esc_attr( $handle ) . '-js"></script>';
}
