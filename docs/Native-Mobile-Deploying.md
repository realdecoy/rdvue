# Deploying Native Mobile Applications

Use the following steps to set up a deployment workflow.

## Link Azure Pipeline to VCS []()

1. Sign into your developer Azure portal account.
2. Go to projects (by default this should be your homepage).
3. If you don't have a pipeline already setup, point to where your code exists whether bitbucket / github / etc
4. Authorize access
5. Navigate to your pipeline file in your repository.

##  Define Variables

1. Select pipeline.
2. Click the edit option.
3. Click variables on the top right.
4. Input the variable name and the value.
5. Select other options if necessary.
6. Save changes.


### Required variables for configuration (Android)
* APP_ALIAS
* KEY_STORE_PASS

## Add Secure Files

1. Under pipelines, select library
2. On the nav panel, select secure files.
3. Click the + icon and then upload the secure file.
   

### Required secure file (Android)
* release-key.keystore

[This is how to generate your android keystore](https://developer.android.com/studio/publish/app-signing#generate-key)

## Download artifacts

?> To be updated.
