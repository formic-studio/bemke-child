<?php
/**
 * Group slider post types under one WordPress admin menu.
 *
 * @package Bemke_Child
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'admin_menu', 'bemke_child_register_slider_admin_menu', 99 );
add_filter( 'parent_file', 'bemke_child_set_slider_admin_parent' );
add_filter( 'submenu_file', 'bemke_child_set_slider_admin_submenu' );

/**
 * Return post types displayed under the Slidery admin menu.
 *
 * Add future slider post types to this list using:
 * 'post-type-slug' => 'Menu label',
 *
 * @return array<string, string>
 */
function bemke_child_get_slider_admin_post_types() {
	return array(
		'strategia-2050' => __( 'Strategia 2050', 'bemke-child' ),
	);
}

/**
 * Register the Slidery parent menu and its post type submenus.
 */
function bemke_child_register_slider_admin_menu() {
	global $submenu;

	$slider_post_types = bemke_child_get_slider_admin_post_types();
	$post_type_slugs   = array_keys( $slider_post_types );
	$first_post_type   = reset( $post_type_slugs );
	$capability        = bemke_child_get_slider_admin_capability(
		$first_post_type
	);

	add_menu_page(
		__( 'Slidery', 'bemke-child' ),
		__( 'Slidery', 'bemke-child' ),
		$capability,
		'bemke-sliders',
		'bemke_child_render_slider_admin_page',
		'dashicons-images-alt2',
		27
	);

	foreach ( $slider_post_types as $post_type => $menu_label ) {
		$post_type_object = get_post_type_object( $post_type );

		if ( ! $post_type_object || ! $post_type_object->show_ui ) {
			continue;
		}

		$submenu_capability = isset( $post_type_object->cap->edit_posts )
			? $post_type_object->cap->edit_posts
			: $capability;

		add_submenu_page(
			'bemke-sliders',
			$menu_label,
			$menu_label,
			$submenu_capability,
			'edit.php?post_type=' . $post_type
		);

		remove_menu_page( 'edit.php?post_type=' . $post_type );
	}

	if ( isset( $submenu['bemke-sliders'] ) ) {
		$submenu['bemke-sliders'] = array_values(
			array_filter(
				$submenu['bemke-sliders'],
				static function ( $menu_item ) {
					return isset( $menu_item[2] ) &&
						'bemke-sliders' !== $menu_item[2];
				}
			)
		);
	}
}

/**
 * Return the edit capability assigned to a slider post type.
 *
 * @param string|null $post_type Slider post type slug.
 * @return string
 */
function bemke_child_get_slider_admin_capability( $post_type ) {
	$post_type_object = $post_type
		? get_post_type_object( $post_type )
		: null;

	return (
		$post_type_object &&
		isset( $post_type_object->cap->edit_posts )
	)
		? $post_type_object->cap->edit_posts
		: 'edit_posts';
}

/**
 * Render a compact landing page for the Slidery menu.
 */
function bemke_child_render_slider_admin_page() {
	$slider_post_types = bemke_child_get_slider_admin_post_types();
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Slidery', 'bemke-child' ); ?></h1>
		<p><?php esc_html_e( 'Wybierz slider, którym chcesz zarządzać.', 'bemke-child' ); ?></p>
		<ul>
			<?php foreach ( $slider_post_types as $post_type => $menu_label ) : ?>
				<?php
				$post_type_object = get_post_type_object( $post_type );

				if (
					! $post_type_object ||
					! current_user_can(
						bemke_child_get_slider_admin_capability( $post_type )
					)
				) {
					continue;
				}
				?>
				<li>
					<a class="button button-primary" href="<?php echo esc_url( admin_url( 'edit.php?post_type=' . $post_type ) ); ?>">
						<?php echo esc_html( $menu_label ); ?>
					</a>
				</li>
			<?php endforeach; ?>
		</ul>
	</div>
	<?php
}

/**
 * Keep the Slidery parent menu active on grouped post type screens.
 *
 * @param string $parent_file Current admin parent file.
 * @return string
 */
function bemke_child_set_slider_admin_parent( $parent_file ) {
	$screen = get_current_screen();

	if (
		$screen &&
		in_array(
			$screen->post_type,
			array_keys( bemke_child_get_slider_admin_post_types() ),
			true
		)
	) {
		return 'bemke-sliders';
	}

	return $parent_file;
}

/**
 * Keep the correct slider submenu active on its post type screens.
 *
 * @param string|null $submenu_file Current admin submenu file.
 * @return string|null
 */
function bemke_child_set_slider_admin_submenu( $submenu_file ) {
	$screen = get_current_screen();

	if (
		$screen &&
		in_array(
			$screen->post_type,
			array_keys( bemke_child_get_slider_admin_post_types() ),
			true
		)
	) {
		return 'edit.php?post_type=' . $screen->post_type;
	}

	return $submenu_file;
}
