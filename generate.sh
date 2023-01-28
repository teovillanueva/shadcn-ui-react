#!/bin/bash

rm -rf download
git clone https://github.com/shadcn/next-template download

version=$(cat package.json | jq ".version")

# --- Main Package ---

mainPackageDir=packages/shadcn-ui
mainPackageSrcDir=$mainPackageDir/src
mainPackageIndexPath=$mainPackageSrcDir/index.ts
mainPackagePackageJsonPath=$mainPackageDir/package.json

mkdir -p $mainPackageDir
mkdir -p $mainPackageSrcDir

rm -rf $mainPackageIndexPath

touch $mainPackageIndexPath
touch $mainPackagePackageJsonPath

mainPackagePackageJsonContent="{
  \"name\": \"@teovilla/shadcn-ui-react\",
  \"version\": $version,
  \"main\": \"src/index.ts\",
  \"dependencies\": {
    \"@teovilla/shadcn-ui-lib\": $version
  }
}"

# --- LIB Package ---

libDir=packages/lib
libSrcDir=$libDir/src
libIndexPath=$libSrcDir/index.ts
libPackageJsonPath=$libDir/package.json

templatePackageJson=$(cat download/package.json)

mkdir -p $libDir
mkdir -p $libSrcDir

touch $libPackageJsonPath

echo "{
  \"name\": \"@teovilla/shadcn-ui-react-lib\",
  \"version\": $version,
  \"main\": \"src/index.ts\"
}" >$libPackageJsonPath

rm -rf $libIndexPath
touch $libIndexPath

for file in ./download/lib/*; do
  filename=$(basename -- "$file")
  component="${filename%.*}"

  cp "$file" packages/lib/src

  echo "export * from \"./$component\"" >>$libIndexPath

done

# --- Component Packages ---

for file in ./download/components/ui/*; do
  filename=$(basename -- "$file")
  component="${filename%.*}"

  packageDir="packages/$component"
  packageSrcDir="$packageDir/src"

  packageIndexPath="$packageSrcDir/index.tsx"
  packageJsonPath="$packageDir/package.json"
  packageName=@teovilla/shadcn-ui-react-$component

  mkdir -p "packages/$component"
  touch "$packageJsonPath"

  packageJsonContent="{
  \"name\": \"$packageName\",
  \"version\": $version,
  \"main\": \"src/index.tsx\",
  \"dependencies\": {
    \"@teovilla/shadcn-ui-lib\": $version
  }
}"

  mainPackagePackageJsonContent=$(echo "$mainPackagePackageJsonContent" | jq ".dependencies[\"$packageName\"] = $version")

  mkdir -p "$packageSrcDir"

  cp "$file" "$packageIndexPath"

  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' 's/\@\/lib\/utils/\@teovilla\/shadcn-ui-lib/' "$packageIndexPath"
  else
    sed -i 's/\@\/lib\/utils/\@teovilla\/shadcn-ui-lib/' "$packageIndexPath"
  fi

  imports=$(awk -F '\t' '/import/' "$packageIndexPath")

  while IFS= read -r line; do
    import="${line##* }"
    if test "$import" != "\"@teovilla/shadcn-ui-lib\""; then
      packageDepVersion=$(echo "$templatePackageJson" | jq ".dependencies[$import]")
      packageJsonContent=$(echo "$packageJsonContent" | jq ".dependencies[$import] = $packageDepVersion")
    fi
  done <<<"$imports"

  echo "$packageJsonContent" >"$packageJsonPath"
  echo "export * from \"$packageName\"" >>$mainPackageIndexPath

done

echo "$mainPackagePackageJsonContent" >"$mainPackagePackageJsonPath"
