
  Pod::Spec.new do |s|
    s.name = 'CapacitorMedia'
    s.version = '0.0.1'
    s.summary = 'Enable some media features for Capacitor, such as create albums, save videos and gifs.'
    s.license = 'MIT'
    s.homepage = 'https://github.com/stewwan/capacitor-media'
    s.author = 'Stewan Silva'
    s.source = { :git => 'https://github.com/stewwan/capacitor-media', :tag => s.version.to_s }
    s.source_files = 'ios/Plugin/Plugin/**/*.{swift,h,m,c,cc,mm,cpp}'
    s.ios.deployment_target  = '11.0'
    s.dependency 'Capacitor'
  end