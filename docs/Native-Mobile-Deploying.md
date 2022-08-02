# Deploying Native Mobile Applications

Deploying your app to the mobile market is not difficult, but also not easy. Before releasing your app to the public, it must be reviewed and approved by the app market's owner. The review process can take anywhere from a day to an indeterminate amount of time. Having a reliable pipeline in place when deploying your app can help reduce the risk of a failed deployment.

## Link Azure Pipeline to VCS

1. Sign in to your developer Azure portal account.
2. Go to projects, which should be your default homepage.
3. If you don't have a pipeline already set up, create one. Make sure it points to where your code exists in Bitbucket/Github/etc
4. Authorize who can access the pipeline.
5. Navigate to your pipeline file in your repository.

##  Define Variables

1. On Azure, Select pipeline.
2. Click the edit option.
3. Click variables on the top right.
4. Input the variable name and the value.
5. Select other options if necessary.
6. Save changes.


### Required variables for configuration (Android)
* APP_ALIAS
* KEY_STORE_PASS

## Add Secure Files

1. On Azure, under pipelines, select library
2. On the nav panel, select secure files.
3. Click the + icon and then upload the secure file.
   

### Required secure file (Android)
* release-key.keystore

[This is how to generate your android keystore](https://developer.android.com/studio/publish/app-signing#generate-key)

## Download artifacts

?> To be updated.
