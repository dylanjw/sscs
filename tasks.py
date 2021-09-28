from invoke import task


@task
def serve(c):
    try:
        c.run(
            "uvicorn --reload --reload-dir sscs --ssl-keyfile=key.key --ssl-certfile cert.crt sscs.asgi:application"
        )
    except FileNotFoundError:
        devcerts(c)
        c.run(
            "uvicorn --reload --reload-dir sscs --ssl-keyfile=key.key --ssl-certfile cert.crt sscs.asgi:application"
        )


@task
def devcerts(c):
    from OpenSSL import crypto, SSL

    emailAddress = "sscs"
    commonName = "sscs"
    countryName = "AA"
    localityName = "sscs"
    stateOrProvinceName = "CS"
    organizationName = "sscs"
    organizationUnitName = "sscs"
    serialNumber = 0
    validityStartInSeconds = 0
    validityEndInSeconds = 10 * 365 * 24 * 60 * 60
    KEY_FILE = "key.key"
    CERT_FILE = "cert.crt"
    k = crypto.PKey()
    k.generate_key(crypto.TYPE_RSA, 4096)
    # create a self-signed cert
    cert = crypto.X509()
    cert.get_subject().C = countryName
    cert.get_subject().ST = stateOrProvinceName
    cert.get_subject().L = localityName
    cert.get_subject().O = organizationName
    cert.get_subject().OU = organizationUnitName
    cert.get_subject().CN = commonName
    cert.get_subject().emailAddress = emailAddress
    cert.set_serial_number(serialNumber)
    cert.gmtime_adj_notBefore(0)
    cert.gmtime_adj_notAfter(validityEndInSeconds)
    cert.set_issuer(cert.get_subject())
    cert.set_pubkey(k)
    cert.sign(k, "sha512")
    with open(CERT_FILE, "wt") as f:
        f.write(
            crypto.dump_certificate(crypto.FILETYPE_PEM, cert).decode("utf-8")
        )
    with open(KEY_FILE, "wt") as f:
        f.write(crypto.dump_privatekey(crypto.FILETYPE_PEM, k).decode("utf-8"))
