window.SongZeroHomepage = (function() {
  var escape = window.SongZeroProfile.escapeHtml;
  var defaultLabels = ['邮箱', '手机号', '微信号', '民族', '政治面貌', 'MBTI', '爱好'];
  var defaultValues = ['email', 'phone', 'wechat', 'ethnicity', 'politicalStatus', 'mbti', 'interests'];

  function list(value, version) {
    if (Array.isArray(value)) return value.map(function(item) { return typeof item === 'string' ? item : item[version] || item.a || ''; });
    return value && (value[version] || value.a) || [];
  }

  function render(profile, language) {
    var isEnglish = language === 'en';
    var locale = isEnglish && profile.translations && profile.translations.en;
    var basic = profile.basic;
    var displayBasic = locale ? locale.basic : null;
    var labels = displayBasic ? displayBasic.metaLabels : defaultLabels;
    var values = displayBasic ? displayBasic.metaValues : defaultValues.map(function(key) { return basic[key]; });
    var skills = profile.skills.map(function(skill, index) { return '<div class="skill-row"><span class="skill-name">' + escape(skill.name) + '</span><span class="skill-level">' + escape(displayBasic ? displayBasic.skillLevels[index] || skill.level : skill.level) + '</span></div>'; }).join('');
    var sections = profile.sections.map(function(source) {
      var sectionLocale = locale && locale.sections[source.id];
      var entries = source.entries.map(function(entry, index) {
        var translated = sectionLocale && sectionLocale.entries[index];
        var title = translated && translated.title || entry.title;
        var tags = translated && translated.tags || entry.tags || [];
        if (source.type === 'awards') {
          var awards = translated && translated.awards || entry.awards || [];
          return '<div class="card timeline-item"><div class="experience-item"><div class="experience-content"><p class="exp-title"><strong>' + escape(title) + '</strong></p><div class="award-group">' + awards.map(function(award) { return '<p class="exp-meta"><span>' + escape(award[0]) + '</span><span>' + escape(award[1]) + '</span></p>'; }).join('') + '</div></div></div></div>';
        }
        var details = translated && translated.details || list(entry.details, 'a');
        var bullets = translated && translated.bullets || list(entry.bullets, 'a');
        var content = source.type === 'education'
          ? '<div class="edu-detail-grid"><div class="edu-detail-row edu-row-1">' + details.slice(0, 3).map(function(detail) { return '<span class="edu-item">' + escape(detail) + '</span>'; }).join('') + '</div><div class="edu-detail-row edu-row-2">' + details.slice(3).map(function(detail) { return '<span class="edu-item">' + escape(detail) + '</span>'; }).join('') + '</div></div>'
          : '<ul class="experience-steps">' + bullets.map(function(bullet) { return '<li>' + escape(bullet) + '</li>'; }).join('') + '</ul>';
        return '<div class="card timeline-item"><div class="experience-item">' + (entry.institutionLogo ? '<img src="' + escape(entry.institutionLogo) + '" alt="" class="institution-logo">' : '') + '<div class="experience-content"><p class="exp-title"><strong>' + escape(title) + '</strong></p><p class="exp-meta">' + tags.map(function(tag) { return '<span>' + escape(tag) + '</span>'; }).join('') + '</p>' + content + '</div></div></div>';
      }).join('');
      return '<div class="section" id="' + escape(source.id) + '"><h2 class="section-title">' + escape(sectionLocale ? sectionLocale.title : source.title) + '</h2><div class="section-body">' + entries + '</div></div>';
    }).join('');
    var aboutDetails = locale ? locale.about.details.slice(0, 2) : list(profile.about.details, 'a');
    var aboutTitle = locale ? locale.about.title : 'About Me';
    var aboutIntro = locale ? locale.about.intro : profile.about.intro;
    var cvLabel = locale ? locale.about.details[2] : profile.about.cvLabel;
    var meta = labels.map(function(label, index) {
      var value = values[index] || '';
      var renderedValue = index === 0 ? '<a href="mailto:' + escape(value) + '">' + escape(value) + '</a>' : escape(value);
      return '<div class="meta-row"><span class="meta-label">' + escape(label) + '</span><span class="meta-value">' + renderedValue + '</span></div>';
    }).join('');
    return '<header class="sidebar"><div class="profile-card"><a class="image avatar"><img src="' + escape(basic.avatar) + '" alt="' + escape(displayBasic ? displayBasic.avatarAlt : basic.name + '的证件照') + '"></a><h1 class="site-name">' + escape(displayBasic ? displayBasic.name : basic.name) + '</h1><h1 class="site-name site-name-sub">' + escape(displayBasic ? displayBasic.alias : basic.alias) + '</h1><div class="profile-meta no-card">' + meta + '</div><div class="skill-card"><div class="skill-card-title">' + escape(displayBasic ? displayBasic.skillTitle : '职业技能') + '</div><div class="skill-list">' + skills + '</div></div></div></header><section class="content"><div class="section" id="about"><h2 class="section-title">' + escape(aboutTitle) + '</h2><div class="section-body"><p class="about-intro">' + escape(aboutIntro) + '</p>' + aboutDetails.map(function(detail) { return '<p class="about-detail">' + escape(detail) + '</p>'; }).join('') + '<p class="about-link"><strong><a href="' + escape(basic.cv) + '" target="_blank" rel="noopener">' + escape(cvLabel) + '</a></strong></p></div></div>' + sections + '</section><footer class="site-footer"><p>' + escape(locale ? locale.footer : '© 2026 宋泽荣. All rights reserved.') + '</p></footer><button id="backToTop" class="back-to-top" type="button" aria-label="返回顶部" title="返回顶部"><i class="fa-solid fa-arrow-up" aria-hidden="true"></i></button>';
  }

  return { render: render, list: list };
})();
