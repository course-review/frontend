<!-- This is such an ugly script but unfortunately my universities IT-services are stuck in the middle ages and this is the best I can do -->
<?php
    function createJwt() {
        $headers = ['alg'=>'RS256','typ'=>'JWT'];
        $headers_encoded = base64url_encode(json_encode($headers));

        $payload = ['exp'=>time()+3600, 'student'=>true, 'unique_id'=>$_SERVER["uniqueID"]];
        $payload_encoded = base64url_encode(json_encode($payload));

        $key_file = fopen('key.txt', 'r');
        $key = fread($key_file, filesize('key.txt'));
        fclose($key_file);

        openssl_sign("$headers_encoded.$payload_encoded", $signature, $key, 'sha256WithRSAEncryption'); 
        $signature_encoded = base64url_encode($signature);

        $token = "$headers_encoded.$payload_encoded.$signature_encoded";
        return $token;
    }

    function base64url_encode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    $redirect = $_GET['redirect'];
    $origin = $_GET['origin'];
    $token = createJwt();

    header("Location: $redirect?jwt=$token&origin=$origin");
?>