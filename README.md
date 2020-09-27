# QTTabBar_Arma3_WorkDrive
QTTabBar buttons and script for building addons and managing P: drive mount/dismount

QTTabBar Buttons -
  * "WorkDrive Mount_Dismount" will mount/unmount P: drive
  * "Addon Builder" will build an addon allowing you to choose project folder, addon folder, and select or create an new sign key to use.
  
Please open up _CheckForP.js_ and set your particular folder paths as described in the top of the file e.g

```javascript
//Paths, fill these in to point to your installed items

//Installed Arma Tools Directory
var ArmaToolsPath = "D:\\Utils\\SteamUtilities\\steamapps\\common\\Arma 3 Tools";

//Path used as P: mount directory
var PDriveMountPath = "E:\\ArmAWork";

//Path to Include list used by AddonBuilder. Include list provides file type extensions of files to be included in the addon build
var FileBankInclude = ArmaToolsPath + "\\FileBank\\include.lst";

//Base path to your WIP addons
var AddonsBuildFolderPath = "P:\\Lars";

//Base path to you installed addons e.g where @SomeMod are stored
var AddonsFolderPath = "F:\\My Documents\\Arma 3 - Other Profiles\\Mods\\My Mods";

//Base Path where you keep your private build keys
var DSSignKeysPath = "F:\\Downloads\\My Games CFG\\ARMA3\\editing\\mod_keys";

//Prefix appplied to any created sign Keys
var DSSignFilePrefix = "LARs_";

//DO NOT EDIT BELOW HERE!!
```

Then edit each buttons configuration -
* by adding each button to QTTabBar and _right click > edit_ and set
  * the buttons icon
  * and __Path__ to where the supplied script _CheckForP.js_ has been placed

* or directly in the button file provided
```XML
<IconResource>"D:\Utils\SteamUtilities\steamapps\common\Arma 3 Tools\WorkDrive\WorkDrive.exe", 0</IconResource>
<Path>F:\Downloads\Downloads\system\Win10\System Utils\QTTabBar\Scripts\CheckForP.js</Path>
```
