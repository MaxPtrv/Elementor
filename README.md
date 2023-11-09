# Elementor home assignment
## Stage 1:

For the first task I chose to write the code in NodeJS, all the code sits the `app.js` file.

It simply checks the CPU level on the current machine (pod in my case),
creates a JSON message from the value and finally sends it to a kafka topic.

All the kafka configuration in my code was done using the `kafkajs` lib.

I called the app cpu-monitor-app, I made a docker image out of it and made a helm chart, 
the Dockerfile is in the root of the repo.

Finally, using helm I deployed everything to the k8s cluster.

To reproduce use:

`helm upgrade --install cpu-monitor-app ./charts/cpu-monitor-app --namespace maxim`

## Stage 2:

**TBH** I started both first and the second task together since I needed to check my code on a kafka topic,

I chose to deploy Bitnami's chart for kafka, while testing my code I had a lot of trouble with the SASL authentication,
and I chose to skip authentication because I spent too much time on it and I wanted to finish all tasks.

To deploy Bitnami/Kafka like I did, use:

`helm install kafka bitnami/kafka --namespace maxim --set tls.sslClientAuth=none --set listeners.client.protocol=PLAINTEXT --set listeners.
controller.protocol=PLAINTEXT --set listeners.external.protocol=PLAINTEXT --set listeners.interbroker.protocol=PLAINTEXT`

## Stage 3:

For the consumer side, I chose to use [Kafka Connect](https://github.com/confluentinc/cp-helm-charts/tree/master/charts/cp-kafka-connect), or to be more specific, [Amazon S3 Sink Connector](https://www.confluent.io/hub/confluentinc/kafka-connect-s3).

For that, I had to first deploy a Kafka Connect cluster, configure it to work with my Kafka cluster,
and finally add the S3 Sink Connector.

Apparently, Kafka Connect's helm chart does not come with the S3 connector packed in it, so I had to do a little rework here.

For that I built a kafka connect docker image with just a small copy command (as can be seen in the kafka-connect-docker directory).

(ps. I didn't add the connector, but for reproduction I added the link in the directory's README)

to reproduce, use:

`helm upgrade --install kafka-connect ./charts/kafka-connect --namespace maxim`

For extra visibility, I used Confluent Control Center.

to reproduce, use:

`helm upgrade --install kafka-connect-control-center ./charts/kafka-connect-control-center --namespace maxim`

Now, when our application, Kafka cluster, Kafka Connect and Control Center are all up and running,
all we need is to add the S3 Sink Connector.

For that, we need to use port-forwarding on our Connect worker and use a REST API call to inject the Connector's config.

to reproduce, use:

`export POD_NAME=$(kubectl get pods --namespace maxim -l "app=kafka-connect" -o jsonpath="{.items[0].metadata.name}")`

`kubectl port-forward $POD_NAME 8083`

`cd ./charts/kafka-connect`

`curl -s -H “Content-Type: application/json” -X POST -d @s3-connector-config.json http://localhost:8083/connectors/`

**And that's pretty much it!**

Our Kafka cluster is getting records from the application, the S3 connector consumes the records and writes them to the relevant S3 bucket!.

I had tons of fun working on this assignment, thank you for that!.
