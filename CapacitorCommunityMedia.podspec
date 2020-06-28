
  Pod::Spec.new do |s|
    s.name = 'CapacitorCommunityMedia'
    s.version = '1.0.0'
    s.summary = 'Enable some media features for Capacitor such as create albums, save videos, gifs and more.'
    s.license = 'MIT'
    s.homepage = 'https://github.com/capacitor-community/media'
    s.author = 'Stewan Silva'
    s.source = { :git => 'https://github.com/capacitor-community/media', :tag => s.version.to_s }
    s.source_files = 'ios/Plugin/Plugin/**/*.{swift,h,m,c,cc,mm,cpp}'
    s.ios.deployment_target  = '11.0'
    s.dependency 'Capacitor'
  end