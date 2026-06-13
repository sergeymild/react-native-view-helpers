
#import "SbnbManager.h"

@implementation SbnbManager
RCT_EXPORT_MODULE(Sbnb)
- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}


- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeSbnbSpecJSI>(params);
}

- (void)setSystemUIColor:(double)color navColor:(double)navColor {}

- (void)setStatusBarStyle:(BOOL)dark {}

@end
