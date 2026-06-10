<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const BEMKE_INSTAGRAM_FEED_CACHE_TIMEOUT = 15 * MINUTE_IN_SECONDS;
const BEMKE_INSTAGRAM_FEED_LIMIT_MAX   = 12;

add_action( 'init', 'bemke_register_instagram_feed_shortcode' );
add_filter( 'the_content', 'bemke_append_instagram_feed_to_falcons_page', 20 );

function bemke_register_instagram_feed_shortcode() {
	add_shortcode( 'bemke_instagram_feed', 'bemke_render_instagram_feed_shortcode' );
}

function bemke_render_instagram_feed_shortcode( $atts = array() ) {
	$atts = shortcode_atts(
		array(
			'limit'        => 8,
			'columns'      => 4,
			'user_id'      => '',
			'access_token' => '',
			'class'        => 'bemke-instagram-feed',
		),
		$atts,
		'bemke_instagram_feed'
	);

	$limit   = min( max( 1, absint( $atts['limit'] ) ), BEMKE_INSTAGRAM_FEED_LIMIT_MAX );
	$columns = min( max( 2, absint( $atts['columns'] ) ), 6 );
	$user_id = sanitize_text_field( (string) $atts['user_id'] );
	$token   = sanitize_text_field( (string) $atts['access_token'] );
	$class   = sanitize_html_class( (string) $atts['class'] );

	$posts = bemke_get_instagram_feed_posts( $limit, $user_id, $token );

	if ( is_wp_error( $posts ) ) {
		if ( current_user_can( 'manage_options' ) ) {
			return sprintf(
				'<p class="bemke-instagram-feed__error">%s</p>',
				esc_html( $posts->get_error_message() )
			);
		}

		return '';
	}

	if ( empty( $posts ) ) {
		return '<p class="bemke-instagram-feed__error">Brak postów z Instagrama.</p>';
	}

	$container_id = uniqid( 'bemke-instagram-feed-' );
	$output       = '';
	$grid_style   = sprintf( 'style="--bemke-instagram-columns:%1$d"', absint( $columns ) );

	$output .= sprintf( '<section class="%1$s" id="%2$s">', esc_attr( $class ), esc_attr( $container_id ) );
	$output .= '<div class="bemke-instagram-feed__grid" ' . $grid_style . '>';

	foreach ( $posts as $post ) {
		if ( empty( $post['permalink'] ) || empty( $post['media_url'] ) ) {
			continue;
		}

		$caption       = isset( $post['caption'] ) ? sanitize_text_field( (string) $post['caption'] ) : '';
		$image_alt     = '' !== $caption ? wp_strip_all_tags( $caption ) : 'Post z Instagrama';
		$media_caption = wp_trim_words( $image_alt, 8, '...' );

		$output .= sprintf(
			'<a class="bemke-instagram-feed__item" href="%1$s" target="_blank" rel="noopener noreferrer" aria-label="%2$s">
				<img loading="lazy" src="%3$s" alt="%2$s">
			</a>',
			esc_url( $post['permalink'] ),
			esc_attr( $media_caption ),
			esc_url( $post['media_url'] )
		);
	}

	$output .= '</div>';
	$output .= '</section>';

	return $output;
}

function bemke_append_instagram_feed_to_falcons_page( $content ) {
	if ( is_admin() || ! is_page( 'falcons-wadowice' ) ) {
		return $content;
	}

	if ( has_shortcode( $content, 'bemke_instagram_feed' ) ) {
		return $content;
	}

	$settings = bemke_get_instagram_feed_settings( '', '' );

	if ( ! $settings['user_id'] || ! $settings['access_token'] ) {
		if ( current_user_can( 'manage_options' ) ) {
			$content .= '<p class="bemke-instagram-feed__error">Brakuje ustawień Instagrama (BEMKE_INSTAGRAM_USER_ID / BEMKE_INSTAGRAM_ACCESS_TOKEN).</p>';
		}

		return $content;
	}

	return $content . do_shortcode( '[bemke_instagram_feed]' );
}

function bemke_get_instagram_feed_posts( $limit = 8, $user_id = '', $access_token = '' ) {
	$settings = bemke_get_instagram_feed_settings( (string) $user_id, (string) $access_token );

	if ( '' === $settings['user_id'] || '' === $settings['access_token'] ) {
		return new WP_Error(
			'bemke_instagram_missing_credentials',
			'Nie ustawiono konfiguracji Instagrama (user_id albo access_token).'
		);
	}

	$limit         = min( max( 1, absint( $limit ) ), BEMKE_INSTAGRAM_FEED_LIMIT_MAX );
	$transient_key = sprintf(
		'bemke_instagram_feed_%1$s_%2$d',
		md5( $settings['user_id'] ),
		$limit
	);

	$cached = get_transient( $transient_key );

	if ( false !== $cached ) {
		return $cached;
	}

	$request_url = add_query_arg(
		array(
			'fields'       => 'id,caption,media_type,media_url,permalink,thumbnail_url',
			'limit'        => $limit,
			'access_token' => $settings['access_token'],
		),
		sprintf( 'https://graph.instagram.com/%s/media', rawurlencode( $settings['user_id'] ) )
	);

	$response = wp_remote_get(
		$request_url,
		array(
			'timeout'    => 12,
			'user-agent' => 'Bemke-Instagram-Feed',
		)
	);

	if ( is_wp_error( $response ) ) {
		return $response;
	}

	$code = wp_remote_retrieve_response_code( $response );
	$body = wp_remote_retrieve_body( $response );
	$data = json_decode( (string) $body, true );

	if ( 200 !== $code || ! is_array( $data ) ) {
		return new WP_Error(
			'bemke_instagram_api_error',
			'Instagram API zwróciło błąd lub nieprawidłową odpowiedź.'
		);
	}

	if ( isset( $data['error'] ) && is_array( $data['error'] ) ) {
		return new WP_Error(
			'bemke_instagram_api_error',
			sanitize_text_field( $data['error']['message'] ?? 'Błąd API Instagrama.' )
		);
	}

	$items = isset( $data['data'] ) && is_array( $data['data'] ) ? $data['data'] : array();
	$posts = array();

	foreach ( $items as $item ) {
		if ( ! is_array( $item ) ) {
			continue;
		}

		$media_type = isset( $item['media_type'] ) ? (string) $item['media_type'] : '';

		if ( 'VIDEO' === $media_type ) {
			continue;
		}

		$media_url = isset( $item['media_url'] ) ? (string) $item['media_url'] : '';

		if ( 'CAROUSEL_ALBUM' === $media_type && '' === $media_url && isset( $item['thumbnail_url'] ) ) {
			$media_url = (string) $item['thumbnail_url'];
		}

		$posts[] = array(
			'id'         => isset( $item['id'] ) ? (string) $item['id'] : '',
			'permalink'  => isset( $item['permalink'] ) ? (string) $item['permalink'] : '',
			'media_url'  => $media_url,
			'caption'    => isset( $item['caption'] ) ? (string) $item['caption'] : '',
			'media_type' => $media_type,
		);
	}

	set_transient( $transient_key, $posts, BEMKE_INSTAGRAM_FEED_CACHE_TIMEOUT );

	return $posts;
}

function bemke_get_instagram_feed_settings( $user_id = '', $access_token = '' ) {
	$user_id = trim( (string) $user_id );
	$token   = trim( (string) $access_token );

	if ( '' === $user_id && defined( 'BEMKE_INSTAGRAM_USER_ID' ) ) {
		$user_id = trim( (string) BEMKE_INSTAGRAM_USER_ID );
	}

	if ( '' === $token && defined( 'BEMKE_INSTAGRAM_ACCESS_TOKEN' ) ) {
		$token = trim( (string) BEMKE_INSTAGRAM_ACCESS_TOKEN );
	}

	return array(
		'user_id'      => $user_id,
		'access_token' => $token,
	);
}
