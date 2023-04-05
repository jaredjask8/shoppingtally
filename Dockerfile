FROM openjdk:17
COPY target/shoppingtally-0.0.2-SNAPSHOT.war app.jar
ENTRYPOINT [ "java", "-jar", "/app.jar" ]
