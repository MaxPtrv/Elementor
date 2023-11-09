# Elementor home assignment
## Stage 1:

For the first task I chose to write the code in NodeJS, all the code sits the `app.js` file.

It simply checks the CPU level on the current machine (pod in my case),
creates a JSON message from the value and finally sends it to a kafka topic.

All the kafka configuration in my code was done using the `kafkajs` lib.

I called the app cpu-monitor-app, I made a docker image out of it and made a helm chart, 
the Dockerfile is in the root of the repo.

Finally using helm I deployed everything to the k8s cluster.

To reproduce use:

`helm upgrade --install cpu-monitor-app .\cpu-monitor-app --namespace maxim`

## Stage 2:

**TBH** I started both first and the second task together since I needed to check my code on a kafka topic,

I chose to deploy Bitnami's chart for kafka, while testing my code I had a lot of trouble with the SASL authentication,
and I chose to skip authentication because I spent too much time on it and I wanted to finish all tasks.

To deploy Bitnami/Kafka like I did, use:

`helm install kafka bitnami/kafka --namespace maxim --set tls.sslClientAuth=none --set listeners.client.protocol=PLAINTEXT --set listeners.
controller.protocol=PLAINTEXT --set listeners.external.protocol=PLAINTEXT --set listeners.interbroker.protocol=PLAINTEXT`

## Stage 3:

