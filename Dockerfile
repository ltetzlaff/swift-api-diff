# Build swift sources from two refs and diff the resulting API
FROM swift:5.1.3

# Workaround for an issue in the swift image https://forums.swift.org/t/lldb-install-precludes-installing-python-in-image/24040
RUN mv /usr/lib/python2.7/site-packages /usr/lib/python2.7/dist-packages && \
    ln -s dist-packages /usr/lib/python2.7/site-packages

# Fetch dependencies
RUN apt-get update && apt-get install -y jq curl
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs

COPY . /

RUN npm ci

ENTRYPOINT [ "/entrypoint.sh" ]
