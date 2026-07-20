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
add_action(
	'admin_footer',
	'bemke_child_print_slider_admin_menu_toggle'
);
add_filter( 'parent_file', 'bemke_child_set_slider_admin_parent', 999 );
add_filter( 'submenu_file', 'bemke_child_set_slider_admin_submenu', 999 );

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
		'strategia-2050'       => __( 'Strategia 2050', 'bemke-child' ),
		'slider-home'          => __( 'Slider Home', 'bemke-child' ),
		'slider-fundacja-bemk' => __( 'Slider Fundacja Bemke', 'bemke-child' ),
		'slider-taekwondo'     => __( 'Slider Taekwondo', 'bemke-child' ),
		'slider-galeria'       => __( 'Slider Usługi – galeria', 'bemke-child' ),
		'slider-przestrzenie'  => __( 'Slider Usługi – przestrzenie', 'bemke-child' ),
		'slider-nauczyciele'   => __( 'Slider Warsztaty dla nauczycieli', 'bemke-child' ),
		'slider-dla-szkol'     => __( 'Slider Warsztaty dla szkół', 'bemke-child' ),
		'slider-warsztaty-cyk' => __( 'Slider Warsztaty cykliczne', 'bemke-child' ),
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
		'__return_null',
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
 * Make the Slidery parent item toggle its submenu without navigating.
 */
function bemke_child_print_slider_admin_menu_toggle() {
	?>
	<script id="bemke-slider-admin-menu-script">
		(function () {
			var menuItem = document.getElementById('toplevel_page_bemke-sliders');

			if (!menuItem) {
				return;
			}

			var trigger = menuItem.querySelector(':scope > a.menu-top');

			if (!trigger) {
				return;
			}

			var isSliderScreen = <?php echo bemke_child_is_slider_admin_screen() ? 'true' : 'false'; ?>;
			var isCurrent =
				isSliderScreen ||
				menuItem.classList.contains('wp-has-current-submenu');

			trigger.setAttribute('aria-haspopup', 'true');

			function setOpen(open) {
				menuItem.classList.toggle('bemke-slider-menu-open', open);
				menuItem.classList.toggle('wp-has-current-submenu', open);
				menuItem.classList.toggle('wp-not-current-submenu', !open);
				menuItem.classList.toggle('wp-menu-open', open);
				trigger.classList.toggle('wp-has-current-submenu', open);
				trigger.classList.toggle('wp-not-current-submenu', !open);
				trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
			}

			if (isSliderScreen) {
				menuItem.classList.add(
					'wp-has-current-submenu',
					'wp-menu-open'
				);
				menuItem.classList.remove('wp-not-current-submenu');
				trigger.classList.add('wp-has-current-submenu');
				trigger.classList.remove('wp-not-current-submenu');
			}

			trigger.setAttribute('aria-expanded', isCurrent ? 'true' : 'false');

			trigger.addEventListener('click', function (event) {
				event.preventDefault();
				event.stopPropagation();

				if (isCurrent) {
					return;
				}

				setOpen(
					!menuItem.classList.contains('bemke-slider-menu-open')
				);
			});

			document.addEventListener('click', function (event) {
				if (
					menuItem.classList.contains('bemke-slider-menu-open') &&
					!menuItem.contains(event.target)
				) {
					setOpen(false);
				}
			});

			document.addEventListener('keydown', function (event) {
				if (
					event.key === 'Escape' &&
					menuItem.classList.contains('bemke-slider-menu-open')
				) {
					setOpen(false);
					trigger.focus();
				}
			});
		})();
	</script>
	<?php
}

/**
 * Check whether the current admin screen belongs to a grouped slider.
 *
 * @return bool
 */
function bemke_child_is_slider_admin_screen() {
	$screen = get_current_screen();

	return (
		$screen &&
		! empty( $screen->post_type ) &&
		in_array(
			$screen->post_type,
			array_keys( bemke_child_get_slider_admin_post_types() ),
			true
		)
	);
}

/**
 * Keep the Slidery parent menu active on grouped post type screens.
 *
 * @param string $parent_file Current admin parent file.
 * @return string
 */
function bemke_child_set_slider_admin_parent( $parent_file ) {
	if ( bemke_child_is_slider_admin_screen() ) {
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

	if ( bemke_child_is_slider_admin_screen() ) {
		return 'edit.php?post_type=' . $screen->post_type;
	}

	return $submenu_file;
}
