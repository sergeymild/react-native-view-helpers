
#import <ViewHelpersSpec/ViewHelpersSpec.h>
#import "BaseAlertController.h"

@interface Alerts : NSObject <NativeAlertsSpec>
@property (weak, nonatomic) BaseAlertController *presentedAlert;
@end
