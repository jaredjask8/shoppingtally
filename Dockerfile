FROM openjdk:17
COPY target/shoppingtally-0.0.1-SNAPSHOT.war app.jar
ENTRYPOINT [ "java", "-jar", "/app.jar" ]
