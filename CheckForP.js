
//Paths, fill these in to point to your installed items
var ArmaToolsPath = "D:\\Utils\\SteamUtilities\\steamapps\\common\\Arma 3 Tools";	//Installed Arma Tools Directory

var PDriveMountPath = "E:\\ArmAWork"; //Path used as P: mount directory
var FileBankInclude = ArmaToolsPath + "\\FileBank\\include.lst";	//Path to Include list used by AddonBuilder. Include list provides file type extensions of files to be included in the addon build
var AddonsBuildFolderPath = "P:\\Lars";	//Base path to your WIP addons
var AddonsFolderPath = "F:\\My Documents\\Arma 3 - Other Profiles\\Mods\\My Mods";	//Base path to you installed addons e.g where @SomeMod are stored
var DSSignKeysPath = "F:\\Downloads\\My Games CFG\\ARMA3\\editing\\mod_keys";	//Base Path where you keep your private build keys
var DSSignFilePrefix = "LARs_";	//Prefix appplied to any created sign Keys

//DO NOT EDIT BELOW HERE!!

var WorkDrivePath = ArmaToolsPath + "\\WorkDrive";	//Path to Arma tool WorkDrive
var DSSignFilePath = ArmaToolsPath + "\\DSSignFile";	//Path to Arma tool DSSignFile
var AddonBuilderPath = ArmaToolsPath + "\\AddonBuilder";	//Path to Arma tool AddonBuilder

//Create file system object
var fso = new ActiveXObject("Scripting.FileSystemObject");

//Create QT scripting object
var qs = new ActiveXObject( "QTTabBarLib.Scripting" );
//Get QT current window
var wnd = qs.ActiveWindow;

//qs.alert( qs.arguments ); //0 = scriptExe, 1 = scriptPath

//Get argument for dismount
var dismount = qs.arguments.count > 2 && ( qs.arguments.item(2) == "true" );
//Get argument for build
var loadAddonBuilder = qs.arguments.count > 3 && ( qs.arguments.item(3) == "true" );

//If the P drive current exists and we are asking for dismount
if ( fso.DriveExists( "P" ) && dismount ) {
	//Dismount P
	wnd.InvokeCommand( "Run", qs.NewCollectionFromItems( WorkDrivePath + "\\WorkDrive.exe", "/Dismount P:", WorkDrivePath ), 1, true );
}else{
	//If P does not exist
	if ( !fso.DriveExists( "P" ) ) {
		//Mount P
		wnd.InvokeCommand( "Run", qs.NewCollectionFromItems( WorkDrivePath + "\\WorkDrive.exe", "/Mount P: " + PDriveMountPath, WorkDrivePath ), 1, true );
	};
};

//If we have asked for a build
if ( loadAddonBuilder ) {

	//Get build folder
	var buildFolderPath = wnd.InvokeCommand("FolderBrowserDialog", "Choose addon base folder to build from", AddonsBuildFolderPath, 16);

	//If we have selected a build folder
	if (buildFolderPath != null) {
		
		//Get addon folder
		var selectedAddonFolderPath = wnd.InvokeCommand( "FolderBrowserDialog", "Choose addons @mod folder", AddonsFolderPath );

		//If we have supplied an addon folder
    	if ( selectedAddonFolderPath != null ) {

			//Some default values
			var SignFileName = "";
			var cancelled = false;

			//Ask if a key is required
    		var includeKey = wnd.InvokeCommand( "MessageBox", "Include Key", 3, 32 );

			if ( includeKey == 6 ) {

				//Ask if a new signing key is required
    			var createNewKey = wnd.InvokeCommand( "MessageBox", "Create New Key", 3, 32 );

    			//If we have asked for a new key
    			if ( createNewKey == 6 ) {
                    
    				//Whilst we have not cancelled AND the new keyname already exist
    				do {
						//Get a name for the new key
						SignFileName = DSSignFilePrefix + qs.InputBox("Project Name, will be prefixed with " + DSSignFilePrefix, "", false);

						//If the key already exists
						if (fso.FileExists(( DSSignKeysPath + "\\" + SignFileName + ".biprivatekey" ) ) ) {
    						//Warn the user and ask if they wish to cancel or provide a new keyname
    						cancelled = wnd.InvokeCommand( "MessageBox", ( "A Signfile with that name \"" + SignFileName + "\" already exists - Please choose a unique name" ), 1, 48 ) == 2;
    					};

						//If the keyname was a blank string
    					if ( SignFileName == "" ) {
    						//Warn the user and ask if they wish to cancel or provide a new keyname
    						cancelled = wnd.InvokeCommand( "MessageBox", ( "Please choose a non blank, unique name" ), 1, 48 ) == 2;
    					};

					} while (!cancelled && fso.FileExists( DSSignKeysPath + "\\" + SignFileName + ".biprivatekey" ) );

					//If the user did not cancel the build
					if ( !cancelled ) {
						//Create the new signing keys
						wnd.InvokeCommand( "Run", qs.NewCollectionFromItems( DSSignFilePath + "\\DSCreateKey.exe", SignFileName, DSSignFilePath ), 5, true);

						//Copy the created keys to the default path DSSignKeysPath
						fso.MoveFile(DSSignFilePath + "\\" + SignFileName + ".biprivatekey", DSSignKeysPath);
						fso.MoveFile(DSSignFilePath + "\\" + SignFileName + ".bikey", DSSignKeysPath);
					};
    			};

				//If we have not asked for a new key
    			if ( createNewKey == 7 ) {

					//TODO: Maybe we can detect the key already used if the built mod already exists and automatically select that?

    				//Whilst the user has not cancelled AND the select existing key is undefined/null
    				do {
    					//Open file broser at DSSignKeysPath to select a file of type .biprivatekey
						selectedFile = wnd.InvokeCommand("OpenFileDialog", "BIPRIVATEKEY (*.biprivatekey)|*.biprivatekey", "Choose private key to sign addon with", DSSignKeysPath );

						//If the selected file is undefined/null
    					if ( selectedFile == undefined || selectedFile == null ) {
    						//Ask the user if they wish to cancel the build
    						cancelled = wnd.InvokeCommand( "MessageBox", ( "No file selected. Do you wish to cancel build" ), 4, 32 ) == 6;

    						//TODO: Maybe the user wishes to create a new key instead
    					};

    				}while ( !cancelled && ( selectedFile == undefined || selectedFile == null ) );

					//If the user did not cancel the build
    				if ( !cancelled ) {
    					//Get the name of the selected .biprivatekey
    					SignFileName = selectedFile.split( "\\" ).reverse()[0].split( "." )[0];
    				};
    			};
			}else{
				SignFileName = "NO_KEY";
			};


			//If the build has not been cancelled
			if ( !cancelled ) {

				//TODO: Include -prefix  -prefix=\"a3\\ui_f\\scripts\\gui\"

				//Create path to private key
				var DSSignFile = DSSignKeysPath + "\\" + SignFileName + ".biprivatekey";

				//Show user build arguments and ask if they still wish to proceed
				cancelled = wnd.InvokeCommand( "MessageBox", ( "Creating addon:\n\n" + buildFolderPath + "\n\nto:\n\n" + selectedAddonFolderPath + "\n\nwith key:\n\n" + SignFileName + "\n\nOK ?" ), 1, 32 ) == 2;

				//If they do
				if ( !cancelled ) {

					if ( SignFileName == "NO_KEY" ) {
						//Create addonBuilder execution collection
						var addonBuilder = qs.NewCollectionFromItems(
							AddonBuilderPath + "\\AddonBuilder.exe",
							"\"" + buildFolderPath + "\" \"" + selectedAddonFolderPath + "\\addons\" -clear -project=p: -include=\"" + FileBankInclude + "\"",
							AddonBuilderPath + "\\AddonBuilder.exe"
						);

						//Run execution collection
						wnd.InvokeCommand( "Run", addonBuilder, 4, true );
					}else{
						//Create addonBuilder execution collection
						var addonBuilder = qs.NewCollectionFromItems(
							AddonBuilderPath + "\\AddonBuilder.exe",
							"\"" + buildFolderPath + "\" \"" + selectedAddonFolderPath + "\\addons\"  -clear -sign=\"" + DSSignFile + "\" -project=p: -include=\"" + FileBankInclude + "\"",
							AddonBuilderPath + "\\AddonBuilder.exe"
						);

						//Run execution collection
						wnd.InvokeCommand( "Run", addonBuilder, 4, true );

						//If the addons folder does not have a key folder
						if ( !fso.FolderExists( ( selectedAddonFolderPath + "\\key" ) ) ) {
							//Create it
							fso.CreateFolder( ( selectedAddonFolderPath + "\\key" ) );
						};

						//Copy the public signing key into the addons key folder
						fso.CopyFile(( DSSignKeysPath + "\\" + SignFileName + ".bikey" ), ( selectedAddonFolderPath + "\\key\\" + SignFileName + ".bikey" ), true );
					};
				}else{
					//Else inform the user the build was cancelled
					wnd.InvokeCommand( "MessageBox", ( "Build cancelled" ), 0, 64 );
				};
			}else{
				//Else inform the user the build was cancelled
				wnd.InvokeCommand( "MessageBox", ( "Build cancelled" ), 0, 64 );
			};
    	};
	};
};

