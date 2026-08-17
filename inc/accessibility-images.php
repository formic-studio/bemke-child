<?php
/**
 * Accessible alternatives for content images rendered by Bricks.
 *
 * Bricks stores part of the image markup in page data, outside this theme. The
 * final-markup pass keeps the alternatives correct for every responsive image
 * size without modifying decorative images, which intentionally retain alt="".
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'BEMKE_CHILD_IMAGE_ALT_EN_META' ) ) {
	define( 'BEMKE_CHILD_IMAGE_ALT_EN_META', '_bemke_image_alt_en' );
}

if ( ! defined( 'BEMKE_CHILD_IMAGE_DECORATIVE_META' ) ) {
	define( 'BEMKE_CHILD_IMAGE_DECORATIVE_META', '_bemke_image_decorative' );
}

if ( ! defined( 'BEMKE_CHILD_IMAGE_ALT_MANAGED_META' ) ) {
	define( 'BEMKE_CHILD_IMAGE_ALT_MANAGED_META', '_bemke_image_alt_managed' );
}

if ( ! defined( 'BEMKE_CHILD_IMAGE_ALT_MIGRATION_VERSION' ) ) {
	define( 'BEMKE_CHILD_IMAGE_ALT_MIGRATION_VERSION', 1 );
}

add_action( 'init', 'bemke_child_register_image_alternative_meta', 5 );
add_action( 'init', 'bemke_child_maybe_migrate_image_alternatives', 30 );
add_filter( 'attachment_fields_to_edit', 'bemke_child_add_image_alternative_fields', 10, 2 );
add_filter( 'attachment_fields_to_save', 'bemke_child_save_image_alternative_fields', 10, 2 );
add_filter( 'manage_media_columns', 'bemke_child_add_image_alternative_columns' );
add_action( 'manage_media_custom_column', 'bemke_child_render_image_alternative_column', 10, 2 );
add_filter( 'wp_get_attachment_image_attributes', 'bemke_child_apply_attachment_image_alternative', 80, 3 );
add_action( 'added_post_meta', 'bemke_child_watch_image_alternative_meta', 10, 4 );
add_action( 'updated_post_meta', 'bemke_child_watch_image_alternative_meta', 10, 4 );
add_action( 'deleted_post_meta', 'bemke_child_watch_image_alternative_meta', 10, 4 );
add_action( 'add_attachment', 'bemke_child_invalidate_image_attachment_filename_index' );
add_action( 'edit_attachment', 'bemke_child_invalidate_image_attachment_filename_index' );
add_action( 'delete_attachment', 'bemke_child_invalidate_image_attachment_filename_index' );

/**
 * Register the English and administrative image-alternative metadata.
 */
function bemke_child_register_image_alternative_meta() {
	$auth_callback = static function ( $allowed, $meta_key, $post_id ) {
		unset( $allowed, $meta_key );

		return current_user_can( 'edit_post', $post_id );
	};

	register_post_meta(
		'attachment',
		BEMKE_CHILD_IMAGE_ALT_EN_META,
		array(
			'type'              => 'string',
			'single'            => true,
			'show_in_rest'      => true,
			'sanitize_callback' => 'sanitize_textarea_field',
			'auth_callback'     => $auth_callback,
		)
	);

	register_post_meta(
		'attachment',
		BEMKE_CHILD_IMAGE_DECORATIVE_META,
		array(
			'type'              => 'boolean',
			'single'            => true,
			'show_in_rest'      => true,
			'sanitize_callback' => 'rest_sanitize_boolean',
			'auth_callback'     => $auth_callback,
		)
	);
}

/**
 * Check whether an attachment is an image, including SVG files when enabled.
 *
 * @param int $attachment_id Attachment post ID.
 * @return bool
 */
function bemke_child_is_image_attachment( $attachment_id ) {
	if ( 'attachment' !== get_post_type( $attachment_id ) ) {
		return false;
	}

	$mime_type = (string) get_post_mime_type( $attachment_id );

	return 0 === strpos( $mime_type, 'image/' );
}

/**
 * Add language-specific alternative fields to Media Library image details.
 *
 * The WordPress core alternative field stores the Polish version so it remains
 * compatible with Bricks and other plugins that read _wp_attachment_image_alt.
 *
 * @param array<string, array<string, mixed>> $fields Attachment fields.
 * @param WP_Post                             $post   Attachment post.
 * @return array<string, array<string, mixed>>
 */
function bemke_child_add_image_alternative_fields( $fields, $post ) {
	if ( ! bemke_child_is_image_attachment( $post->ID ) ) {
		return $fields;
	}

	if ( isset( $fields['image_alt'] ) ) {
		$fields['image_alt']['label'] = __( 'Tekst alternatywny (ALT PL)', 'bemke-child' );
		$fields['image_alt']['helps'] = __(
			'Polski opis obrazu. Zmiana w tym polu jest automatycznie widoczna na polskiej wersji strony.',
			'bemke-child'
		);
	} else {
		$fields['image_alt'] = array(
			'label' => __( 'Tekst alternatywny (ALT PL)', 'bemke-child' ),
			'input' => 'textarea',
			'value' => (string) get_post_meta( $post->ID, '_wp_attachment_image_alt', true ),
			'helps' => __(
				'Polski opis obrazu. Zmiana w tym polu jest automatycznie widoczna na polskiej wersji strony.',
				'bemke-child'
			),
		);
	}

	$fields['bemke_image_alt_en'] = array(
		'label' => __( 'Tekst alternatywny (ALT EN)', 'bemke-child' ),
		'input' => 'textarea',
		'value' => (string) get_post_meta( $post->ID, BEMKE_CHILD_IMAGE_ALT_EN_META, true ),
		'helps' => __(
			'Angielski opis obrazu. Dopóki pole jest puste, wersja angielska używa ALT PL.',
			'bemke-child'
		),
	);

	$fields['bemke_image_decorative'] = array(
		'label' => __( 'Dostępność', 'bemke-child' ),
		'input' => 'html',
		'html'  => sprintf(
			'<label><input type="checkbox" name="attachments[%1$d][bemke_image_decorative]" value="1"%2$s> %3$s</label>',
			(int) $post->ID,
			checked( '1', (string) get_post_meta( $post->ID, BEMKE_CHILD_IMAGE_DECORATIVE_META, true ), false ),
			esc_html__( 'Obraz dekoracyjny — pomiń w czytnikach ekranu', 'bemke-child' )
		),
		'helps' => __(
			'Zaznaczenie ustawia pusty alt w obu wersjach językowych. Wpisane opisy pozostają zapisane na wypadek ponownego użycia.',
			'bemke-child'
		),
	);

	return $fields;
}

/**
 * Save the Media Library alternative fields.
 *
 * @param array<string, mixed> $post       Attachment post data.
 * @param array<string, mixed> $attachment Submitted attachment fields.
 * @return array<string, mixed>
 */
function bemke_child_save_image_alternative_fields( $post, $attachment ) {
	$attachment_id = isset( $post['ID'] ) ? absint( $post['ID'] ) : 0;

	if ( ! $attachment_id || ! bemke_child_is_image_attachment( $attachment_id ) ) {
		return $post;
	}

	if ( array_key_exists( 'image_alt', $attachment ) ) {
		update_post_meta(
			$attachment_id,
			'_wp_attachment_image_alt',
			sanitize_textarea_field( wp_unslash( $attachment['image_alt'] ) )
		);
	}

	if ( array_key_exists( 'bemke_image_alt_en', $attachment ) ) {
		$alt_en = sanitize_textarea_field( wp_unslash( $attachment['bemke_image_alt_en'] ) );

		if ( '' === $alt_en ) {
			delete_post_meta( $attachment_id, BEMKE_CHILD_IMAGE_ALT_EN_META );
		} else {
			update_post_meta( $attachment_id, BEMKE_CHILD_IMAGE_ALT_EN_META, $alt_en );
		}
	}

	if ( ! empty( $attachment['bemke_image_decorative'] ) ) {
		update_post_meta( $attachment_id, BEMKE_CHILD_IMAGE_DECORATIVE_META, '1' );
	} else {
		delete_post_meta( $attachment_id, BEMKE_CHILD_IMAGE_DECORATIVE_META );
	}

	update_post_meta( $attachment_id, BEMKE_CHILD_IMAGE_ALT_MANAGED_META, '1' );
	bemke_child_schedule_image_alternative_cache_purge();

	return $post;
}

/**
 * Add quick audit columns to the Media Library list view.
 *
 * @param array<string, string> $columns Existing columns.
 * @return array<string, string>
 */
function bemke_child_add_image_alternative_columns( $columns ) {
	$columns['bemke_alt_pl'] = __( 'ALT PL', 'bemke-child' );
	$columns['bemke_alt_en'] = __( 'ALT EN', 'bemke-child' );

	return $columns;
}

/**
 * Render Media Library alternative audit columns.
 *
 * @param string $column_name Column identifier.
 * @param int    $post_id     Attachment post ID.
 */
function bemke_child_render_image_alternative_column( $column_name, $post_id ) {
	if (
		! in_array( $column_name, array( 'bemke_alt_pl', 'bemke_alt_en' ), true ) ||
		! bemke_child_is_image_attachment( $post_id )
	) {
		return;
	}

	if ( '1' === (string) get_post_meta( $post_id, BEMKE_CHILD_IMAGE_DECORATIVE_META, true ) ) {
		echo '<em>' . esc_html__( 'Dekoracyjny', 'bemke-child' ) . '</em>';
		return;
	}

	$meta_key = 'bemke_alt_en' === $column_name
		? BEMKE_CHILD_IMAGE_ALT_EN_META
		: '_wp_attachment_image_alt';
	$value    = trim( (string) get_post_meta( $post_id, $meta_key, true ) );

	if ( '' !== $value ) {
		echo esc_html( wp_html_excerpt( $value, 90, '…' ) );
		return;
	}

	if ( 'bemke_alt_en' === $column_name ) {
		echo '<em>' . esc_html__( 'Fallback: ALT PL', 'bemke-child' ) . '</em>';
		return;
	}

	echo '<strong>' . esc_html__( 'Brak', 'bemke-child' ) . '</strong>';
}

/**
 * Return the active frontend language used for image alternatives.
 *
 * @return string Either "pl" or "en".
 */
function bemke_child_get_image_alternative_language() {
	static $resolved_language = null;

	if ( null !== $resolved_language ) {
		return $resolved_language;
	}

	$language = '';

	if ( function_exists( 'pll_current_language' ) ) {
		$language = (string) pll_current_language( 'slug' );
	}

	if ( '' === $language ) {
		$language = (string) apply_filters( 'wpml_current_language', '' );
	}

	if ( '' === $language && defined( 'ICL_LANGUAGE_CODE' ) ) {
		$language = (string) ICL_LANGUAGE_CODE;
	}

	if ( function_exists( 'is_page' ) && is_page( 'home-en-404' ) ) {
		$language = 'en';
	}

	if ( '' === $language ) {
		$locale   = function_exists( 'determine_locale' ) ? determine_locale() : get_locale();
		$language = (string) $locale;
	}

	$resolved_language = 0 === stripos( $language, 'en' ) ? 'en' : 'pl';

	return $resolved_language;
}

/**
 * Resolve the current alternative for one Media Library attachment.
 *
 * @param int    $attachment_id Attachment post ID, if available.
 * @param string $filename      Original filename for legacy fallback.
 * @return array{found: bool, text: string}
 */
function bemke_child_get_attachment_image_alternative( $attachment_id, $filename = '' ) {
	$attachment_id = absint( $attachment_id );

	if ( $attachment_id ) {
		if ( '' === $filename ) {
			$attached_file = (string) get_post_meta( $attachment_id, '_wp_attached_file', true );
			$filename      = wp_basename( $attached_file );
		}

		if ( '1' === (string) get_post_meta( $attachment_id, BEMKE_CHILD_IMAGE_DECORATIVE_META, true ) ) {
			return array(
				'found' => true,
				'text'  => '',
			);
		}

		if ( 'en' === bemke_child_get_image_alternative_language() ) {
			$alt_en = trim( (string) get_post_meta( $attachment_id, BEMKE_CHILD_IMAGE_ALT_EN_META, true ) );

			if ( '' !== $alt_en ) {
				return array(
					'found' => true,
					'text'  => $alt_en,
				);
			}
		}

		$alt_pl  = trim( (string) get_post_meta( $attachment_id, '_wp_attachment_image_alt', true ) );
		$managed = metadata_exists( 'post', $attachment_id, BEMKE_CHILD_IMAGE_ALT_MANAGED_META );

		if ( '' !== $alt_pl || $managed ) {
			return array(
				'found' => true,
				'text'  => $alt_pl,
			);
		}
	}

	return bemke_child_get_legacy_image_alternative( $filename );
}

/**
 * Return alternative text as a string for Bricks data helpers.
 *
 * @param int    $attachment_id Attachment post ID.
 * @param string $filename      Original filename for fallback.
 * @return string
 */
function bemke_child_get_attachment_image_alternative_text( $attachment_id, $filename = '' ) {
	$alternative = bemke_child_get_attachment_image_alternative( $attachment_id, $filename );

	return $alternative['found'] ? $alternative['text'] : '';
}

/**
 * Look up an alternative in the temporary migration map.
 *
 * @param string $filename Original image filename.
 * @return array{found: bool, text: string}
 */
function bemke_child_get_legacy_image_alternative( $filename ) {
	$filename     = (string) $filename;
	$alternatives = bemke_child_get_image_alternatives();

	if ( array_key_exists( $filename, $alternatives ) ) {
		return array(
			'found' => true,
			'text'  => $alternatives[ $filename ],
		);
	}

	$normalized_filename = strtolower( $filename );

	foreach ( $alternatives as $mapped_filename => $alternative ) {
		if ( strtolower( $mapped_filename ) === $normalized_filename ) {
			return array(
				'found' => true,
				'text'  => $alternative,
			);
		}
	}

	$unscaled_filename = preg_replace( '/-scaled(?=\.[^.]+$)/i', '', $filename );

	if ( is_string( $unscaled_filename ) && $unscaled_filename !== $filename ) {
		return bemke_child_get_legacy_image_alternative( $unscaled_filename );
	}

	return array(
		'found' => false,
		'text'  => '',
	);
}

/**
 * Build an attachment index keyed by original upload filename.
 *
 * @return array<string, array<int, int>>
 */
function bemke_child_get_image_attachment_filename_index() {
	static $index = null;

	if ( null !== $index ) {
		return $index;
	}

	$cached_index = get_transient( 'bemke_child_image_attachment_filename_index_v1' );

	if ( is_array( $cached_index ) ) {
		$index = $cached_index;

		return $index;
	}

	global $wpdb;

	$index = array();
	$rows  = $wpdb->get_results(
		$wpdb->prepare(
			"SELECT pm.post_id, pm.meta_value
			FROM {$wpdb->postmeta} AS pm
			INNER JOIN {$wpdb->posts} AS p ON p.ID = pm.post_id
			WHERE pm.meta_key = %s
				AND p.post_type = %s
				AND p.post_mime_type LIKE %s
			ORDER BY pm.post_id ASC",
			'_wp_attached_file',
			'attachment',
			'image/%'
		),
		ARRAY_A
	);

	foreach ( $rows as $row ) {
		$attachment_id = absint( $row['post_id'] );
		$attached_file = (string) $row['meta_value'];
		$filename      = strtolower( wp_basename( $attached_file ) );

		if ( '' === $filename ) {
			continue;
		}

		if ( ! isset( $index[ $filename ] ) ) {
			$index[ $filename ] = array();
		}

		$index[ $filename ][] = $attachment_id;
	}

	set_transient(
		'bemke_child_image_attachment_filename_index_v1',
		$index,
		12 * HOUR_IN_SECONDS
	);

	return $index;
}

/**
 * Invalidate the filename index after an attachment changes.
 *
 * @param int $attachment_id Attachment post ID.
 */
function bemke_child_invalidate_image_attachment_filename_index( $attachment_id = 0 ) {
	unset( $attachment_id );

	delete_transient( 'bemke_child_image_attachment_filename_index_v1' );
}

/**
 * Resolve an attachment by its canonical filename.
 *
 * @param string $filename Canonical image filename.
 * @return int
 */
function bemke_child_get_image_attachment_id_by_filename( $filename ) {
	$index = bemke_child_get_image_attachment_filename_index();
	$key   = strtolower( (string) $filename );

	if ( isset( $index[ $key ][0] ) ) {
		return absint( $index[ $key ][0] );
	}

	$scaled_key = preg_replace( '/(?=\.[^.]+$)/', '-scaled', $key, 1 );

	return is_string( $scaled_key ) && isset( $index[ $scaled_key ][0] )
		? absint( $index[ $scaled_key ][0] )
		: 0;
}

/**
 * Migrate the verified Polish alternatives into the WordPress Media Library.
 *
 * This runs once per migration version and never overwrites a non-empty value
 * already entered by an editor.
 */
function bemke_child_maybe_migrate_image_alternatives() {
	$option_name = 'bemke_child_image_alt_migration';
	$lock_name   = 'bemke_child_image_alt_migration_lock';
	$state       = get_option( $option_name, array() );

	if (
		is_array( $state ) &&
		isset( $state['version'] ) &&
		BEMKE_CHILD_IMAGE_ALT_MIGRATION_VERSION === (int) $state['version']
	) {
		return;
	}

	$lock_time = (int) get_option( $lock_name, 0 );

	if ( $lock_time && ( time() - $lock_time ) < 10 * MINUTE_IN_SECONDS ) {
		return;
	}

	if ( $lock_time ) {
		delete_option( $lock_name );
	}

	if ( ! add_option( $lock_name, time(), '', false ) ) {
		return;
	}

	$alternatives = bemke_child_get_image_alternatives();
	$index        = bemke_child_get_image_attachment_filename_index();
	$matched      = array();
	$processed    = array();
	$result       = array(
		'version'     => BEMKE_CHILD_IMAGE_ALT_MIGRATION_VERSION,
		'migrated'    => 0,
		'decorative'  => 0,
		'preserved'   => 0,
		'attachments' => 0,
		'missing'     => array(),
		'completed_at' => current_time( 'mysql', true ),
	);

	try {
		foreach ( $alternatives as $filename => $alternative ) {
			$key        = strtolower( $filename );
			$scaled_key = preg_replace( '/(?=\.[^.]+$)/', '-scaled', $key, 1 );

			if ( empty( $index[ $key ] ) && is_string( $scaled_key ) && ! empty( $index[ $scaled_key ] ) ) {
				$key = $scaled_key;
			}

			if ( empty( $index[ $key ] ) ) {
				continue;
			}

			$matched[ $filename ] = true;

			foreach ( $index[ $key ] as $attachment_id ) {
				if ( isset( $processed[ $attachment_id ] ) ) {
					continue;
				}

				$processed[ $attachment_id ] = true;
				++$result['attachments'];

				$current_alt = trim( (string) get_post_meta( $attachment_id, '_wp_attachment_image_alt', true ) );
				$managed     = metadata_exists( 'post', $attachment_id, BEMKE_CHILD_IMAGE_ALT_MANAGED_META );

				if ( '' !== $current_alt || $managed ) {
					++$result['preserved'];
					continue;
				}

				if ( '' === $alternative ) {
					update_post_meta( $attachment_id, BEMKE_CHILD_IMAGE_DECORATIVE_META, '1' );
					++$result['decorative'];
				} else {
					update_post_meta( $attachment_id, '_wp_attachment_image_alt', $alternative );
					++$result['migrated'];
				}

				update_post_meta( $attachment_id, BEMKE_CHILD_IMAGE_ALT_MANAGED_META, '1' );
			}
		}

		$result['missing'] = array_values( array_diff( array_keys( $alternatives ), array_keys( $matched ) ) );
		update_option( $option_name, $result, false );
		bemke_child_schedule_image_alternative_cache_purge();
	} finally {
		delete_option( $lock_name );
	}
}

/**
 * Apply the language-appropriate alternative to WordPress-generated images.
 *
 * @param array<string, string> $attr       Image HTML attributes.
 * @param WP_Post               $attachment Attachment post.
 * @param string|array<int, int> $size      Requested image size.
 * @return array<string, string>
 */
function bemke_child_apply_attachment_image_alternative( $attr, $attachment, $size ) {
	unset( $size );

	$alternative = bemke_child_get_attachment_image_alternative( $attachment->ID );

	if ( $alternative['found'] ) {
		$attr['alt'] = $alternative['text'];
	}

	return $attr;
}

/**
 * Mark direct alternative changes as managed and invalidate the page cache.
 *
 * @param int|array<int, int> $meta_id    Meta row ID or deleted row IDs.
 * @param int                 $object_id  Attachment post ID.
 * @param string              $meta_key   Changed meta key.
 * @param mixed               $meta_value Changed meta value.
 */
function bemke_child_watch_image_alternative_meta( $meta_id, $object_id, $meta_key, $meta_value ) {
	unset( $meta_id, $meta_value );

	if ( '_wp_attached_file' === $meta_key && 'attachment' === get_post_type( $object_id ) ) {
		bemke_child_invalidate_image_attachment_filename_index( $object_id );
		return;
	}

	$watched_keys = array(
		'_wp_attachment_image_alt',
		BEMKE_CHILD_IMAGE_ALT_EN_META,
		BEMKE_CHILD_IMAGE_DECORATIVE_META,
	);

	if (
		! in_array( $meta_key, $watched_keys, true ) ||
		! bemke_child_is_image_attachment( $object_id )
	) {
		return;
	}

	if ( '_wp_attachment_image_alt' === $meta_key ) {
		update_post_meta( $object_id, BEMKE_CHILD_IMAGE_ALT_MANAGED_META, '1' );
	}

	bemke_child_schedule_image_alternative_cache_purge();
}

/**
 * Purge LiteSpeed page cache once after one or more alternative changes.
 */
function bemke_child_schedule_image_alternative_cache_purge() {
	static $scheduled = false;

	if ( $scheduled ) {
		return;
	}

	$scheduled = true;
	add_action( 'shutdown', 'bemke_child_purge_image_alternative_cache', 999 );
}

/**
 * Ask LiteSpeed Cache to regenerate frontend pages with the updated alt text.
 */
function bemke_child_purge_image_alternative_cache() {
	do_action( 'litespeed_purge_all' );
}

/**
 * Replace missing or generic alternatives in the final frontend markup.
 *
 * @param string $html Complete frontend response markup.
 * @return string
 */
function bemke_child_prepare_image_alternatives( $html ) {
	$donor_name = '';

	if ( is_singular( 'darczynca' ) ) {
		$donor_id   = get_queried_object_id();
		$donor_name = $donor_id ? get_the_title( $donor_id ) : '';
		$donor_name = trim( wp_strip_all_tags( $donor_name ) );
	}

	$updated_html = preg_replace_callback(
		'/<img\b[^>]*>/i',
		static function ( $matches ) use ( $donor_name ) {
			$image_tag        = $matches[0];
			$alt_text         = '';
			$alternative_found = false;

			if (
				'' !== $donor_name &&
				preg_match( '/\bid\s*=\s*(["\'])brxe-vvqtfa\1/i', $image_tag ) &&
				! preg_match( '/\balt\s*=\s*(["\'])[^"\']+\1/i', $image_tag )
			) {
				$alt_text          = sprintf( '%s, darczyńca Campusu Bemke', $donor_name );
				$alternative_found = true;
			}

			if ( ! $alternative_found ) {
				if ( ! preg_match( '/\ssrc\s*=\s*(["\'])([^"\']+)\1/i', $image_tag, $source_match ) ) {
					return $image_tag;
				}

				$filename      = bemke_child_get_canonical_image_filename( $source_match[2] );
				$attachment_id = bemke_child_get_image_attachment_id_by_filename( $filename );
				$alternative   = bemke_child_get_attachment_image_alternative( $attachment_id, $filename );

				if ( ! $alternative['found'] ) {
					return $image_tag;
				}

				$alt_text = $alternative['text'];
			}

			$alt_attribute = 'alt="' . esc_attr( $alt_text ) . '"';

			if ( preg_match( '/\salt\s*=\s*(["\'])[^"\']*\1/i', $image_tag ) ) {
				$updated_tag = preg_replace(
					'/\salt\s*=\s*(["\'])[^"\']*\1/i',
					' ' . $alt_attribute,
					$image_tag,
					1
				);

				return null === $updated_tag ? $image_tag : $updated_tag;
			}

			$updated_tag = preg_replace( '/\s*\/?>$/', ' ' . $alt_attribute . '>', $image_tag, 1 );

			return null === $updated_tag ? $image_tag : $updated_tag;
		},
		$html
	);

	return null === $updated_html ? $html : $updated_html;
}

/**
 * Normalize WordPress responsive-size filenames to their original upload name.
 *
 * @param string $source Image URL from an img element.
 * @return string
 */
function bemke_child_get_canonical_image_filename( $source ) {
	$path = wp_parse_url( html_entity_decode( $source, ENT_QUOTES, 'UTF-8' ), PHP_URL_PATH );

	if ( ! is_string( $path ) || '' === $path ) {
		return '';
	}

	$filename            = rawurldecode( wp_basename( $path ) );
	$canonical_filename  = preg_replace( '/-\d+x\d+(?=\.[^.]+$)/i', '', $filename );

	return null === $canonical_filename ? $filename : $canonical_filename;
}

/**
 * Image alternatives verified against the public staging site on 5 August 2026.
 *
 * Decorative colour textures (CTA backgrounds and section backgrounds) are
 * deliberately absent from this list and therefore retain alt="".
 *
 * @return array<string, string>
 */
function bemke_child_get_image_alternatives() {
	return array(
		// Images previously using the generic value "Opis zdjęcia".
		'AnimowaneCampus2.webp'                         => 'Wizualizacja planowanego Budynku Centralnego na Campusie Bemke',
		'AnimowaneEdukacjaCollege.webp'                => 'Uczniowie Bemke College rozmawiający podczas spaceru po kampusie',
		'AnimowaneEdukacjaPrzedszkole.webp'            => 'Dzieci bawiące się na świeżym powietrzu w Przedszkolu Bemke',
		'AnimowaneEdukacjaPrzedszkoleM-J.webp'          => 'Dzieci podczas zajęć plastycznych w Przedszkolu Bemke',
		'AnimowaneEdukacjaSzkolaPodstawowa.webp'       => 'Uczennice z zebranymi rzodkiewkami podczas zajęć w ogrodzie',
		'AnimowaneExploreLeadecamp.webp'               => 'Młodzież pracująca w grupach podczas warsztatów',
		'AnimowaneExplorePolkolonie.webp'              => 'Uczestniczki półkolonii podczas zajęć na świeżym powietrzu',
		'AnimowaneExploreTutoring.webp'                => 'Uczestnicy programu Bemke Explore w auli',
		'AnimowaneFalconsKoszykowka.webp'              => 'Zawodnicy podczas meczu koszykówki',
		'AnimowaneRozwojExplore.webp'                  => 'Młodzież podczas wspólnej aktywności na Campusie Bemke',
		'AnimowaneRozwojFalcons.webp'                  => 'Trener prowadzący trening taekwondo dla dzieci',
		'AnimowaneRozwojSteam.webp'                    => 'Uczniowie konstruujący drewniane mechanizmy podczas warsztatów STEAM',
		'AnimowaneUslugiCollegium.webp'                => 'Wizualizacja odnowionego Collegium Marianum i otaczającego go ogrodu',
		'AnimowaneUslugiFirmy.webp'                    => 'Bufet z przekąskami przygotowany na wydarzenie firmowe',
		'AnimowaneUslugiHala.webp'                     => 'Dzieci podczas treningu taekwondo w hali sportowej',
		'AnimowaneUslugiImprezy.webp'                  => 'Desery i wypieki przygotowane w ramach cateringu Bemke',
		'AnimowaneUslugiNoclegi.webp'                  => 'Przygotowane łóżko w pokoju noclegowym',
		'AnimowaneUslugiWioska.webp'                   => 'Wioska Edukacyjna Campus Bemke otoczona zielenią',
		'AnimowaneWarsztatyCyklicznePinball.webp'      => 'Uczestnicy konstruujący mechaniczną grę podczas warsztatów',
		'AnimowaneWarsztatyCykliczneSensoryka.webp'    => 'Uczestniczki wybierające materiały do budowy ścieżki sensorycznej',
		'AnimowaneWarsztatyCykliczneSzycie.webp'       => 'Przybory do szycia i projektowania ubrań',
		'AnimowaneWarsztatyCykliczneWarsztat.webp'     => 'Narzędzia i materiały do pracy nad makietą miasta',
		'raisingstars.webp'                             => 'Chłopiec wykonujący technikę podczas treningu taekwondo',
		'22.07CampusCollegium-2.webp'                  => 'Młodzież przed budynkiem Collegium Marianum',
		'22.07CampusInne-2.webp'                       => 'Uczniowie pracujący w ogrodzie FarmLab',
		'22.07CampusPrzedszkole-2.webp'                => 'Budynek Przedszkola Bemke na terenie kampusu',
		'23.07explorezimowisko.webp'                   => 'Dzieci bawiące się na śniegu podczas zimowiska',
		'historiadzis.webp'                            => 'Wioska Edukacyjna Campus Bemke otoczona zielenią',
		'instytut.webp'                                => 'Prowadząca podczas szkolenia dla nauczycieli',
		'kampaniafaza1.webp'                           => 'Zabudowania Wioski Edukacyjnej na Campusie Bemke',
		'nauczyciele.webp'                             => 'Uczestnicy szkolenia dla nauczycieli z otrzymanymi dyplomami',
		'nowepraca.webp'                               => 'Prowadząca eksperyment podczas zajęć z dziećmi',

		// Klub Sportowy Bemke and taekwondo.
		'669884602_17874081528590836_196652035836319748_n.webp' => 'Drużyna koszykarska Klubu Sportowego Bemke wraz z kibicami',
		'670015487_17874166446590836_201119490585457460_n.webp' => 'Koszykarz Klubu Sportowego Bemke po meczu',
		'670427704_1266258081724141_7525645878990105553_n.webp' => 'Mecz koszykówki Klubu Sportowego Bemke',
		'670566012_2073723400237599_428121321002526520_n.webp' => 'Kibice dopingujący drużynę Klubu Sportowego Bemke',
		'670572217_978908764821665_7939144766066790169_n.webp' => 'Zawodnicy podczas sparingu taekwondo',
		'670906058_17874847833590836_147947746522227371_n.webp' => 'Dzieci ćwiczące kopnięcia podczas treningu taekwondo',
		'726231338_17886278301590836_6545446551525098733_n.webp' => 'Uczestnicy treningu taekwondo z dyplomami',
		'736349266_1068741058817375_6061577178798875752_n.webp' => 'Grafika z tekstem: Dziękujemy Wam za ten rok z KS Bemke!',
		'741402765_17890541100590836_3686788760103826506_n.webp' => 'Taekwondo – podsumowanie pierwszego roku Klubu Sportowego',
		'742130640_17890189341590836_6952206934610918084_n.webp' => '70 meczów – ogromna dawka boiskowej walki i rywalizacji o każdy punkt',
		'elite.webp'                                   => 'Pokaz technik taekwondo dla dzieci i rodziców',
		'foto.webp'                                    => 'Trener sprawdzający kopnięcie dziecka podczas egzaminu taekwondo',
		'trener.webp'                                  => 'Trener taekwondo z uczestniczkami i dyplomem ukończenia egzaminu',
		'KaruzelaTaekwondo1.webp'                      => 'Dziewczynka wykonująca kopnięcie w tarczę podczas treningu taekwondo',
		'KaruzelaTaekwondo2.webp'                      => 'Chłopiec prezentujący kopnięcie podczas egzaminu taekwondo',
		'KaruzelaTaekwondo3.webp'                      => 'Trener zawiązujący dziecku żółty pas taekwondo',
		'KaruzelaTaekwondo4.webp'                      => 'Pokaz rozbijania desek podczas egzaminu taekwondo',
		'KaruzelaTaekwondo5.webp'                      => 'Uśmiechnięta uczestniczka otrzymująca żółty pas taekwondo',
		'KaruzelaTaekwondo6.webp'                      => 'Trener prowadzący zajęcia taekwondo dla dzieci',
		'KaruzelaTaekwondo7.webp'                      => 'Dzieci ćwiczące w parach podczas treningu taekwondo',
		'KaruzelaTaekwondo8.webp'                      => 'Uczestniczka przybijająca piątkę z trenerem taekwondo',

		// Bemke history, team and community.
		'zalozyciele-2.webp'                           => 'Karolina i Tomasz Domogała, założyciele Bemke',
		'1909.webp'                                    => 'Archiwalne zdjęcie budynku Collegium Marianum',
		'2013.webp'                                    => 'Dzieci rysujące kredą podczas zajęć na świeżym powietrzu',
		'2022.webp'                                    => 'Uczestnicy Kampanii Założycielskiej Bemke podczas spotkania w auli',
		'2foto.webp'                                   => 'Archiwalne zajęcia uczniów na świeżym powietrzu',
		'karuzela1.webp'                               => 'Archiwalne zdjęcie uczniów przy kamiennym moście',
		'lata20.webp'                                  => 'Archiwalne zdjęcie budynku Collegium Marianum',
		'teraz.webp'                                   => 'Uczennice rozmawiające przy stole przed Collegium Marianum',
		'22.07historia.webp'                           => 'Archiwalne zdjęcie wychowanków i księdza w parku',
		'22.07historia-scaled.webp'                    => 'Archiwalne zdjęcie wychowanków i księdza w parku',
		'22.07historia2.webp'                          => 'Archiwalne zdjęcie grupy wychowanków z akordeonem',
		'Historia1947.webp'                            => 'Archiwalne zdjęcie uczniów podczas gry w tenisa stołowego',
		'NOWA.webp'                                    => 'Archiwalne zdjęcie wychowanków i opiekunów Collegium Marianum',
		'2025-1.webp'                                  => 'Uczniowie wykonujący doświadczenie w szkolnym laboratorium',
		'2025EdukacjaPozaformalna.webp'                => 'Dziecko wykonujące kopnięcie podczas treningu taekwondo',
		'2025Partnerstwo.webp'                         => 'Uczestnicy Kampanii Założycielskiej Bemke podczas spotkania w auli',
		'2025ThinkTank.webp'                           => 'Uczestnicy spotkania eksperckiego przy wspólnym stole',
		'2025WsparcieRodzin.webp'                      => 'Nauczycielka i dzieci podczas zajęć w szkolnym ogrodzie',
		'2025WzorowePlacowki.webp'                     => 'Nauczycielka pracująca z uczniami w szkolnej bibliotece',
		'bemke2050SzkolenieNauczycieli.webp'           => 'Uczestniczki szkolenia dla nauczycieli',
		// The person's name and role are already provided immediately beside these portraits.
		// Empty alternatives prevent screen readers from announcing the same information twice.
		'nowyportretdaria.webp'                        => '',
		'nowyportretkasia.webp'                        => '',
		'nowyportretprzemek.webp'                      => '',
		'urszula.webp'                                 => '',
		'urszula-1.webp'                               => '',
		'kasiabaran.webp'                              => 'Katarzyna Ostrowska, Fundraising Manager',
		'portret1.webp'                                => 'Olek, uczestnik programu Bemke Explore',
		'portret3.webp'                                => 'Ania, uczestniczka programu Bemke Explore',
		'portet2.webp'                                 => 'Anita, uczestniczka programu Bemke Explore',

		// Education, campus and workshops.
		'FotoFullScreen-scaled.webp'                  => 'Uczniowie odpoczywający na dziedzińcu Wioski Edukacyjnej',
		'grafika1.webp'                               => 'Dziecięce dłonie trzymające drewnianą rakietę',
		'grafika2.webp'                               => 'Dłonie trzymające makietę budynku Wioski Edukacyjnej',
		'karta1.webp'                                 => 'Uczestnicy szkolenia w pracowni Wioski Edukacyjnej',
		'karta2.webp'                                 => 'Dzieci budujące drewniany domek podczas warsztatów',
		'karta3-1.webp'                               => 'Dzieci konstruujące robota podczas zajęć STEAM',
		'karta3.webp'                                 => 'Wioska Edukacyjna Campus Bemke otoczona ogrodem',
		'karuzela1-1.webp'                            => 'Uczennice rozmawiające przy stole przed Collegium Marianum',
		'karuzela2.webp'                              => 'Uczestnicy wydarzenia w auli Wioski Edukacyjnej',
		'KaruzelaMainPage1.webp'                      => 'Uczniowie przechodzący obok ogrodu FarmLab',
		'KaruzelaMainPage2.webp'                      => 'Nauczycielka i dzieci obserwujący doświadczenie',
		'KaruzelaMainPage3.webp'                      => 'Uczennice rozmawiające przy stole przed Collegium Marianum',
		'KaruzelaMainPage4.webp'                      => 'Wnętrze auli Wioski Edukacyjnej',
		'KaruzelaMainPage5.webp'                      => 'Trener prowadzący zajęcia taekwondo dla dzieci',
		'KaruzelaMainPage6.webp'                      => 'Detal elewacji Wioski Edukacyjnej z logo Bemke',
		'KaruzelaMainPage7.webp'                      => 'Uczennice stojące razem w parku Campusu Bemke',
		'KaruzelaMainPage8.webp'                      => 'Uczennice prezentujące wykonaną wspólnie makietę domu',
		'21.07cykliczne.webp'                         => 'Prowadzący pomaga uczniom budować konstrukcję z materiałów z recyklingu',
		'21.07dlanauczycieli.webp'                    => 'Nauczycielka i dzieci podczas zajęć w szkolnym ogrodzie',
		'21.07dlaszkol.webp'                          => 'Uczennice prezentujące wykonaną wspólnie makietę domu',
		'21.07eksperymenty.webp'                      => 'Dzieci wykonujące doświadczenie z cieczami',
		'21.07farmlab.webp'                           => 'Uczniowie pracujący w ogrodzie FarmLab',
		'21.07majsterkowanie.webp'                    => 'Uczniowie majsterkujący w pracowni MakerSpace',
		'21.07sztukaikreatywnosc.webp'                => 'Uczeń tworzący rzeźbę z gliny',
		'22.07edukacja.webp'                          => 'Młodzież podczas zajęć w szkolnej bibliotece',
		'22.07karuzela1-2.webp'                       => 'Uczeń szyjący na maszynie podczas warsztatów',
		'22.07karuzela2-2.webp'                       => 'Uczniowie pracujący z masą plastyczną podczas warsztatów',
		'22.07karuzela3-2.webp'                       => 'Dziecko układające mozaikę z nasion',
		'22.07karuzela4-2.webp'                       => 'Dzieci wspólnie malujące podczas warsztatów',
		'22.07karuzela5-2.webp'                       => 'Uczeń wycinający element z drewna na wyrzynarce',
		'22.07karuzela6-2.webp'                       => 'Prowadząca demonstrująca doświadczenie podczas zajęć z dziećmi',
		'22.07karuzela7-2.webp'                       => 'Dzieci malujące pod opieką prowadzącej',
		'cykliczne1.webp'                             => 'Prowadzący pomaga uczniowi łączyć elementy konstrukcji',
		'cykliczne2.webp'                             => 'Uczeń tworzący rzeźbę z gliny',
		'cykliczne3.webp'                             => 'Dzieci budujące hotel dla owadów',
		'cykliczne4.webp'                             => 'Dzieci wykonujące doświadczenie z cieczami',
		'cykliczne5.webp'                             => 'Uczeń modelujący głowę z gliny',
		'cykliczne6.webp'                             => 'Dzieci obserwujące doświadczenie w pracowni',
		'designthinking-2.webp'                      => 'Dłonie trzymające przybory do kreatywnego projektowania',
		'steam-2.webp'                               => 'Dłonie trzymające linijki i lornetkę',

		// Workshops for teachers.
		'KaruzelaSTEAM1.webp'                         => 'Uczestnicy szkolenia w pracowni Wioski Edukacyjnej',
		'KaruzelaSTEAM2.webp'                         => 'Nauczyciele pracujący nad prototypem z kartonu',
		'KaruzelaSTEAM3.webp'                         => 'Prowadząca prezentująca drewniany model podczas szkolenia',
		'KaruzelaSTEAM4.webp'                         => 'Uczestniczki szkolenia omawiające przygotowany szkic',
		'KaruzelaSTEAM5.webp'                         => 'Uczestnicy budujący ruchomy model dłoni z kartonu',
		'KaruzelaSTEAM6.webp'                         => 'Nauczyciele pracujący w grupach podczas szkolenia STEAM',

		// Campus services, rooms and catering.
		'catering0.webp'                              => 'Bufet grillowy z warzywami i opisem menu',
		'catering1.webp'                              => 'Mini burgery przygotowane w ramach cateringu Bemke',
		'catering2.webp'                              => 'Półmisek z kanapkami i przekąskami cateringowymi',
		'catering3.webp'                              => 'Kwiaty stanowiące dekorację stołu',
		'catering4.webp'                              => 'Golonka z kapustą podana w ramach cateringu Bemke',
		'miejsca0.webp'                               => 'Schody widowni w auli Wioski Edukacyjnej',
		'miejsca1.webp'                               => 'Sala lekcyjna w Wiosce Edukacyjnej',
		'miejsca3.webp'                               => 'Ogród FarmLab z widokiem na góry',
		'miejsca4.webp'                               => 'Pracownia laboratoryjna w Wiosce Edukacyjnej',
		'miejsca5.webp'                               => 'Aula Wioski Edukacyjnej z widokiem na dziedziniec',
		'miejsca6.webp'                               => 'Sala szkoleniowa z ekranem multimedialnym',
		'miejsca7.webp'                               => 'Ceglane schody i taras Wioski Edukacyjnej',

		// Maps, donors, press materials and partner logos.
		'Darczyncy.webp'                              => 'Tablica darczyńcy Grupa Maspex przy Budynku Głównym Campusu Bemke',
		'nowadarczyncyfoto-scaled.webp'               => 'Uczniowie odpoczywający na dziedzińcu Wioski Edukacyjnej',
		'nowedarczyncy-scaled.webp'                   => 'Darczyńcy Kampanii Założycielskiej Bemke podczas spotkania w auli',
		'LLObszar-roboczy-9-kopia-2@2x.webp'          => 'Dofinansowane przez Unię Europejską',
		'LLObszar-roboczy-9-kopia-3@2x.webp'          => 'Małopolska',
		'LLObszar-roboczy-9-kopia@2x.webp'            => 'Rzeczpospolita Polska',
		'LLObszar-roboczy-9@2x.webp'                  => 'Fundusze Europejskie dla Małopolski',
		'logo-horizontal-on-light.svg'                => 'Pracodawcy RP',
		'logo1@2x.webp'                               => 'Komitet do spraw Pożytku Publicznego',
		'logo2@2x.webp'                               => 'Narodowy Instytut Wolności',
		'logo3@2x.webp'                               => 'Fundusz Młodzieżowy',
		'mapka-mobile-bemke-scaled.webp'              => 'Plan Campusu Bemke z zaznaczonymi najważniejszymi obiektami',
		'maps-bemke-info-scaled.webp'                 => 'Plan Campusu Bemke z zaznaczonymi najważniejszymi obiektami',
		'nowelogopack.webp'                           => 'Logo Bemke',
		'nowepaczkazdjec.webp'                        => 'Dzieci majsterkujące w pracowni MakerSpace',
		'nowabemkefundacja2.webp'                     => 'Przejdź do strony Fundacji Bemke',
		'nowafundacjacampusbemke.webp'                => 'Przejdź do strony Fundacji Campus Bemke',
		'praca-m-2.png'                               => 'Wnętrze auli Wioski Edukacyjnej podczas wydarzenia',
	);
}
