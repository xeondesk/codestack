# FROM alpine:3.16
FROM scratch

COPY --chown=33333:33333 out /ide/extensions/codestack-web/out/
COPY --chown=33333:33333 public /ide/extensions/codestack-web/public/
COPY --chown=33333:33333 resources /ide/extensions/codestack-web/resources/
COPY --chown=33333:33333 package.json package.nls.json README.md LICENSE.txt /ide/extensions/codestack-web/
