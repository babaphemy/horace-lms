# Run Kubernetes Locally

### Install docker

```bash
brew install docker
```

### Install Minikube CLI

```bash
brew install minikube
```

### Start Minikube

```bash
minikube start --driver=docker
```

### Test

```bash
kubectl get nodes
```
