<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const BEMKE_GETRESPONSE_API_KEY_OPTION     = 'bemke_getresponse_api_key';
const BEMKE_GETRESPONSE_CAMPAIGN_ID_OPTION = 'bemke_getresponse_campaign_id';
const BEMKE_GETRESPONSE_DEFAULT_CAMPAIGN_ID = 'XGhMQ';

add_action( 'admin_menu', 'bemke_register_getresponse_settings_page' );
add_action( 'admin_init', 'bemke_handle_getresponse_settings_save' );
add_action( 'bricks/form/custom_action', 'bemke_handle_getresponse_form_submission' );

function bemke_register_getresponse_settings_page() {
	add_options_page(
		'Bemke GetResponse',
		'Bemke GetResponse',
		'manage_options',
		'bemke-getresponse',
		'bemke_render_getresponse_settings_page'
	);
}

function bemke_handle_getresponse_settings_save() {
	if ( ! is_admin() || ! current_user_can( 'manage_options' ) ) {
		return;
	}

	if ( ! isset( $_POST['bemke_getresponse_settings_nonce'] ) ) {
		return;
	}

	check_admin_referer( 'bemke_save_getresponse_settings', 'bemke_getresponse_settings_nonce' );

	$redirect_url = add_query_arg(
		array(
			'page'                       => 'bemke-getresponse',
			'bemke_getresponse_saved'    => '1',
		),
		admin_url( 'options-general.php' )
	);

	if ( isset( $_POST['bemke_clear_getresponse_api_key'] ) ) {
		delete_option( BEMKE_GETRESPONSE_API_KEY_OPTION );
		wp_safe_redirect( $redirect_url );
		exit;
	}

	$new_api_key = isset( $_POST['bemke_getresponse_api_key'] )
		? trim( (string) wp_unslash( $_POST['bemke_getresponse_api_key'] ) )
		: '';

	if ( '' !== $new_api_key ) {
		update_option( BEMKE_GETRESPONSE_API_KEY_OPTION, $new_api_key, false );
	}

	$campaign_id = isset( $_POST['bemke_getresponse_campaign_id'] )
		? sanitize_text_field( (string) wp_unslash( $_POST['bemke_getresponse_campaign_id'] ) )
		: '';

	if ( '' !== $campaign_id ) {
		update_option( BEMKE_GETRESPONSE_CAMPAIGN_ID_OPTION, $campaign_id, false );
	} else {
		delete_option( BEMKE_GETRESPONSE_CAMPAIGN_ID_OPTION );
	}

	wp_safe_redirect( $redirect_url );
	exit;
}

function bemke_render_getresponse_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$has_constant_api_key = defined( 'BEMKE_GETRESPONSE_API_KEY' ) && '' !== BEMKE_GETRESPONSE_API_KEY;
	$has_option_api_key   = '' !== (string) get_option( BEMKE_GETRESPONSE_API_KEY_OPTION, '' );
	$api_key_placeholder  = $has_option_api_key ? str_repeat( '*', 24 ) : '';
	$campaign_id          = bemke_getresponse_get_campaign_id();
	?>
	<div class="wrap">
		<h1>Bemke GetResponse</h1>

		<?php if ( isset( $_GET['bemke_getresponse_saved'] ) ) : ?>
			<div class="notice notice-success is-dismissible">
				<p>Ustawienia GetResponse zostały zapisane.</p>
			</div>
		<?php endif; ?>

		<p>Ten panel obsługuje zapis z formularza newslettera Bricks do GetResponse. Formularz musi mieć akcję <strong>Custom</strong> i pola o nazwach: <code>name</code>, <code>email</code>, <code>privacy</code>, <code>marketing</code>.</p>

		<table class="form-table" role="presentation">
			<tr>
				<th scope="row">Status API key</th>
				<td>
					<?php if ( $has_constant_api_key ) : ?>
						API key jest ustawiony w <code>wp-config.php</code>.
					<?php elseif ( $has_option_api_key ) : ?>
						API key jest ustawiony w panelu WordPress.
					<?php else : ?>
						API key nie jest jeszcze ustawiony.
					<?php endif; ?>
				</td>
			</tr>
			<tr>
				<th scope="row">Campaign ID / lista</th>
				<td><code><?php echo esc_html( $campaign_id ); ?></code></td>
			</tr>
		</table>

		<form method="post" action="">
			<?php wp_nonce_field( 'bemke_save_getresponse_settings', 'bemke_getresponse_settings_nonce' ); ?>

			<table class="form-table" role="presentation">
				<tr>
					<th scope="row">
						<label for="bemke_getresponse_api_key">API key</label>
					</th>
					<td>
						<input
							type="password"
							id="bemke_getresponse_api_key"
							name="bemke_getresponse_api_key"
							class="regular-text"
							value=""
							placeholder="<?php echo esc_attr( $api_key_placeholder ); ?>"
							autocomplete="new-password"
							<?php disabled( $has_constant_api_key ); ?>
						>
						<p class="description">Najbezpieczniej ustawić API key w <code>wp-config.php</code> jako <code>BEMKE_GETRESPONSE_API_KEY</code>. Jeśli wpiszesz go tutaj, zostanie zapisany w bazie WordPress.</p>
					</td>
				</tr>
				<tr>
					<th scope="row">
						<label for="bemke_getresponse_campaign_id">Campaign ID</label>
					</th>
					<td>
						<input
							type="text"
							id="bemke_getresponse_campaign_id"
							name="bemke_getresponse_campaign_id"
							class="regular-text"
							value="<?php echo esc_attr( $campaign_id ); ?>"
							<?php disabled( defined( 'BEMKE_GETRESPONSE_CAMPAIGN_ID' ) && '' !== BEMKE_GETRESPONSE_CAMPAIGN_ID ); ?>
						>
						<p class="description">Aktualna lista z panelu GetResponse: <code>marketing</code>, ID: <code>XGhMQ</code>.</p>
					</td>
				</tr>
			</table>

			<?php submit_button( 'Zapisz ustawienia' ); ?>

			<?php if ( ! $has_constant_api_key && $has_option_api_key ) : ?>
				<p>
					<button type="submit" name="bemke_clear_getresponse_api_key" value="1" class="button button-secondary">
						Usuń API key
					</button>
				</p>
			<?php endif; ?>
		</form>
	</div>
	<?php
}

function bemke_handle_getresponse_form_submission( $form ) {
	$fields = method_exists( $form, 'get_fields' ) ? $form->get_fields() : array();

	if ( ! is_array( $fields ) || ! bemke_getresponse_is_newsletter_form( $fields ) ) {
		return;
	}

	$name      = sanitize_text_field( (string) bemke_getresponse_get_field_value( $fields, array( 'name', 'form-field-name' ) ) );
	$email     = sanitize_email( (string) bemke_getresponse_get_field_value( $fields, array( 'email', 'form-field-email' ) ) );
	$privacy   = bemke_getresponse_is_checked( bemke_getresponse_get_field_value( $fields, array( 'privacy', 'form-field-privacy' ) ) );
	$marketing = bemke_getresponse_is_checked( bemke_getresponse_get_field_value( $fields, array( 'marketing', 'form-field-marketing' ) ) );

	if ( '' === $name || ! is_email( $email ) ) {
		bemke_getresponse_set_form_result( $form, 'danger', 'Uzupełnij poprawnie imię i nazwisko oraz adres e-mail.' );
		return;
	}

	if ( ! $privacy || ! $marketing ) {
		bemke_getresponse_set_form_result( $form, 'danger', 'Zaznacz wymagane zgody, aby zapisać się do newslettera.' );
		return;
	}

	$api_key     = bemke_getresponse_get_api_key();
	$campaign_id = bemke_getresponse_get_campaign_id();

	if ( '' === $api_key || '' === $campaign_id ) {
		bemke_getresponse_set_form_result( $form, 'danger', 'Integracja newslettera nie jest jeszcze skonfigurowana.' );
		return;
	}

	$response = bemke_getresponse_create_contact(
		array(
			'name'       => $name,
			'email'      => $email,
			'campaignId' => $campaign_id,
			'ipAddress'  => bemke_getresponse_get_client_ip(),
		),
		$api_key
	);

	if ( is_wp_error( $response ) ) {
		error_log( 'Bemke GetResponse error: ' . $response->get_error_message() );
		bemke_getresponse_set_form_result( $form, 'danger', 'Nie udało się zapisać do newslettera. Spróbuj ponownie za chwilę.' );
		return;
	}

	$status_code = (int) wp_remote_retrieve_response_code( $response );

	if ( 202 === $status_code ) {
		bemke_getresponse_set_form_result( $form, 'success', 'Dziękujemy za zapis do newslettera.' );
		return;
	}

	if ( 409 === $status_code ) {
		bemke_getresponse_set_form_result( $form, 'success', 'Ten adres e-mail jest już zapisany do newslettera.' );
		return;
	}

	$error_message = bemke_getresponse_get_response_error_message( $response );
	error_log( sprintf( 'Bemke GetResponse HTTP %d: %s', $status_code, $error_message ) );
	bemke_getresponse_set_form_result( $form, 'danger', 'Nie udało się zapisać do newslettera. Spróbuj ponownie za chwilę.' );
}

function bemke_getresponse_create_contact( array $contact, $api_key ) {
	$body = array(
		'email'    => $contact['email'],
		'name'     => $contact['name'],
		'campaign' => array(
			'campaignId' => $contact['campaignId'],
		),
	);

	if ( ! empty( $contact['ipAddress'] ) ) {
		$body['ipAddress'] = $contact['ipAddress'];
	}

	return wp_remote_post(
		'https://api.getresponse.com/v3/contacts',
		array(
			'timeout' => 15,
			'headers' => array(
				'Accept'       => 'application/json',
				'Content-Type' => 'application/json',
				'X-Auth-Token' => 'api-key ' . $api_key,
			),
			'body'    => wp_json_encode( $body ),
		)
	);
}

function bemke_getresponse_is_newsletter_form( array $fields ) {
	$has_email = null !== bemke_getresponse_get_field_value( $fields, array( 'email', 'form-field-email' ) );
	$has_name  = null !== bemke_getresponse_get_field_value( $fields, array( 'name', 'form-field-name' ) );
	$has_optin = null !== bemke_getresponse_get_field_value( $fields, array( 'privacy', 'form-field-privacy' ) )
		|| null !== bemke_getresponse_get_field_value( $fields, array( 'marketing', 'form-field-marketing' ) );

	return $has_email && $has_name && $has_optin;
}

function bemke_getresponse_get_field_value( array $fields, array $keys ) {
	foreach ( $keys as $key ) {
		if ( array_key_exists( $key, $fields ) ) {
			return $fields[ $key ];
		}
	}

	return null;
}

function bemke_getresponse_is_checked( $value ) {
	if ( is_array( $value ) ) {
		return ! empty(
			array_filter(
				$value,
				function ( $item ) {
					return bemke_getresponse_is_checked( $item );
				}
			)
		);
	}

	$normalized = strtolower( trim( (string) $value ) );

	if ( '' === $normalized ) {
		return false;
	}

	return ! in_array( $normalized, array( '0', 'no', 'off', 'false', 'nie' ), true );
}

function bemke_getresponse_get_api_key() {
	if ( defined( 'BEMKE_GETRESPONSE_API_KEY' ) && '' !== BEMKE_GETRESPONSE_API_KEY ) {
		return trim( (string) BEMKE_GETRESPONSE_API_KEY );
	}

	return trim( (string) get_option( BEMKE_GETRESPONSE_API_KEY_OPTION, '' ) );
}

function bemke_getresponse_get_campaign_id() {
	if ( defined( 'BEMKE_GETRESPONSE_CAMPAIGN_ID' ) && '' !== BEMKE_GETRESPONSE_CAMPAIGN_ID ) {
		return trim( (string) BEMKE_GETRESPONSE_CAMPAIGN_ID );
	}

	$campaign_id = trim( (string) get_option( BEMKE_GETRESPONSE_CAMPAIGN_ID_OPTION, '' ) );

	return '' !== $campaign_id ? $campaign_id : BEMKE_GETRESPONSE_DEFAULT_CAMPAIGN_ID;
}

function bemke_getresponse_get_client_ip() {
	$remote_addr = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( (string) wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';

	return filter_var( $remote_addr, FILTER_VALIDATE_IP ) ? $remote_addr : '';
}

function bemke_getresponse_get_response_error_message( $response ) {
	$body = json_decode( (string) wp_remote_retrieve_body( $response ), true );

	if ( is_array( $body ) && ! empty( $body['message'] ) ) {
		return sanitize_text_field( (string) $body['message'] );
	}

	return 'Unknown GetResponse error.';
}

function bemke_getresponse_set_form_result( $form, $type, $message ) {
	if ( ! method_exists( $form, 'set_result' ) ) {
		return;
	}

	$form->set_result(
		array(
			'type'    => $type,
			'message' => esc_html( $message ),
		)
	);
}
