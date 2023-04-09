FROM openjdk:17
WORKDIR /test
COPY target/shoppingtally-0.0.2-SNAPSHOT.war .
RUN echo $(ls)
ENTRYPOINT [ "java", "-jar", "shoppingtally-0.0.2-SNAPSHOT.war" ]
