# vue-starter

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Run your unit tests
```
npm run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
```
```


# Bitbucket Pipeline

## Setup
```
npm install
```

### Compiles and minifies for production
```
npm run build
```

### Varibales to be set by user
```

              variables:
                AWS_ACCESS_KEY_ID: $AWS_ACCESS_KEY_ID
                AWS_SECRET_ACCESS_KEY: $AWS_SECRET_ACCESS_KEY
                AWS_DEFAULT_REGION: '<AWS_DEFAULT_REGION>'
                S3_BUCKET: '<S3-Bucket-Name>'
```

### Further setup explanation
See [Get started with Bitbucket Pipelines](https://support.atlassian.com/bitbucket-cloud/docs/get-started-with-bitbucket-pipelines/).

```
```


# Github Pipeline

## Setup
```
npm install
```

### Compiles and minifies for production
```
npm run build
```

### Varibales to be set by user
```

    - uses: shallwefootball/s3-upload-action@master
      

      with:
        aws_key_id: ${{ secrets.AWS_KEY_ID }}
        aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY}}
        aws_bucket: ${{ secrets.AWS_BUCKET }}
        source_dir: 'dist'
```

### Further setup explanation
See [CI/CD Using Github Actions And Amazon AWS S3](https://medium.com/@mranjbar.z2993/ci-cd-using-github-actions-and-amazon-aws-s3-9693db13adda).
