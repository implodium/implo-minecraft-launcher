import UniversalPath from "../uitl/UniversalPath";
import * as os from "os";
import {injectable} from "inversify";

@injectable()
export class PathController {

    public readonly installPath = new UniversalPath(
        `C:\\Users\\${os.userInfo().username}\\AppData\\Roaming\\.implo-launcher\\`,
        `/Users/${os.userInfo().username}/Library/ApplicationSupport/.implo-launcher/`
    )

    public readonly minecraftHomePath = new UniversalPath(
        `C:\\Users\\${os.userInfo().username}\\AppData\\Roaming\\.minecraft\\`,
        `/Users/${os.userInfo().username}/Library/ApplicationSupport/minecraft/`
    )
}
