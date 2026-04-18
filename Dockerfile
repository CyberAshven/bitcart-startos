FROM bitcart/bitcart:stable

RUN apt-get update \
  && apt-get install -y --no-install-recommends curl jq \
  && rm -rf /var/lib/apt/lists/*

# Reset upstream entrypoint so StartOS daemon command is authoritative.
ENTRYPOINT []
CMD ["sleep", "infinity"]
