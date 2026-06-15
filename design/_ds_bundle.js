/* @ds-bundle: {"format":3,"namespace":"AICDbDesignSystem_beee55","components":[],"sourceHashes":{"ui_kits/web-app/AddContent.jsx":"841024c56188","ui_kits/web-app/AddContentFields.jsx":"f81466fc96a9","ui_kits/web-app/AddContentPreview.jsx":"47935a4ec899","ui_kits/web-app/Admin.jsx":"07ce68c5046b","ui_kits/web-app/AdminContent.jsx":"e0acd1f4c9cc","ui_kits/web-app/AdminUsersStats.jsx":"f3836da7f22a","ui_kits/web-app/App.jsx":"915771d52c46","ui_kits/web-app/BrandIcons.jsx":"338ce21d71f6","ui_kits/web-app/BrowsePages.jsx":"7de65006cdec","ui_kits/web-app/Creator.jsx":"e5c28c2ba7ff","ui_kits/web-app/CreatorManage.jsx":"13d8705ce7c5","ui_kits/web-app/CreatorParts.jsx":"6599d52b5e86","ui_kits/web-app/CreatorSetup.jsx":"f443e4cbffd9","ui_kits/web-app/CreatorsPage.jsx":"3cdf04a94395","ui_kits/web-app/DetailParts.jsx":"f29b6a4b7fa1","ui_kits/web-app/Discover.jsx":"92dbcfe14338","ui_kits/web-app/Extras.jsx":"79ecf2500b5e","ui_kits/web-app/Feed.jsx":"22c8fa0d6a5d","ui_kits/web-app/Feedback.jsx":"89124ec19adc","ui_kits/web-app/FeedbackFlama.jsx":"0fb7830ff60d","ui_kits/web-app/FilmCard.jsx":"a0f898203919","ui_kits/web-app/FilmDetail.jsx":"fd2fccc86955","ui_kits/web-app/Login.jsx":"59ecd26305e1","ui_kits/web-app/LoginModal.jsx":"f29e5b41f9e0","ui_kits/web-app/NavBar.jsx":"c3a5a777113b","ui_kits/web-app/Preferences.jsx":"f6e9b65367ac","ui_kits/web-app/Primitives.jsx":"f4b26cbe6071","ui_kits/web-app/Profile.jsx":"43c64e1c6fb8","ui_kits/web-app/RatingPanel.jsx":"6368b16f0516","ui_kits/web-app/Signup.jsx":"22ca588ba027","ui_kits/web-app/Watching.jsx":"86be44dc0f38","ui_kits/web-app/WhatIs.jsx":"56870d4ca99c","ui_kits/web-app/admin-data.js":"cac8ef796684","ui_kits/web-app/catalog-extra.js":"c88976da13eb","ui_kits/web-app/data.js":"b11227b6f9b7","ui_kits/web-app/theme-init.js":"2a9267cc07a1"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.AICDbDesignSystem_beee55 = window.AICDbDesignSystem_beee55 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/web-app/AddContent.jsx
try { (() => {
// Dreamwall UI kit — Add Content page. 3-step submission flow with live preview.
const AC_STEPS = [{
  n: 1,
  label: 'Type & basics'
}, {
  n: 2,
  label: 'Media & tags'
}, {
  n: 3,
  label: 'Credits & legal'
}];
const AC_MODEL_SUGGESTIONS = ['Runway Gen-3', 'Sora', 'Midjourney', 'Veo', 'Kling', 'Pika', 'Stable Video', 'Flux'];

// ---- progress indicator ----
function Stepper({
  step,
  maxStep,
  onJump
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      margin: '4px 0 36px'
    }
  }, AC_STEPS.map((s, i) => {
    const state = step === s.n ? 'current' : s.n < step ? 'done' : 'todo';
    const clickable = s.n <= maxStep;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: s.n
    }, /*#__PURE__*/React.createElement("div", {
      onClick: () => clickable && onJump(s.n),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 13,
        cursor: clickable ? 'pointer' : 'default'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 36,
        height: 36,
        flex: 'none',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        font: '700 15px/1 var(--font-mono)',
        background: state === 'current' ? 'var(--coral)' : state === 'done' ? 'var(--coral-ghost)' : 'var(--bg-2)',
        color: state === 'current' ? 'var(--fg-on-accent)' : state === 'done' ? 'var(--coral-bright)' : 'var(--fg-2)',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: state === 'todo' ? 'var(--border-subtle)' : 'transparent',
        transition: 'color var(--dur-base) var(--ease-out)'
      }
    }, state === 'done' ? /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 16,
      color: "var(--coral-bright)",
      weight: "bold"
    }) : s.n), /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "overline",
      style: {
        color: state === 'todo' ? 'var(--fg-3)' : 'var(--fg-2)'
      }
    }, "Step ", s.n), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 14px/1.2 var(--font-body)',
        marginTop: 3,
        color: state === 'current' ? 'var(--fg-0)' : state === 'todo' ? 'var(--fg-2)' : 'var(--fg-1)'
      }
    }, s.label))), i < AC_STEPS.length - 1 && /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 2,
        margin: '0 20px',
        borderRadius: 2,
        background: s.n < step ? 'var(--coral-dim)' : 'var(--border-subtle)',
        transition: 'background var(--dur-base)'
      }
    }));
  }));
}

// ======================= STEPS =======================
function Step1({
  form,
  set,
  nextEpisode
}) {
  const series = form.type === 'series';
  const isEpisode = series && form.seriesMode === 'episode';
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionTitle, {
    icon: "sparkles",
    hint: "Pick a format \u2014 the fields below adapt to it."
  }, "Content type"), /*#__PURE__*/React.createElement(TypeSelector, {
    value: form.type,
    onChange: v => set({
      type: v,
      ...(v !== 'series' ? {
        seriesMode: 'new'
      } : {})
    })
  }), series && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement(SectionTitle, {
    icon: "television-simple",
    hint: "Adding a brand-new series, or a new episode to one you already have on Dreamwall?"
  }, "Series"), /*#__PURE__*/React.createElement(SeriesModeSelector, {
    value: form.seriesMode,
    onChange: v => set({
      seriesMode: v
    })
  })), /*#__PURE__*/React.createElement(Divider, null), isEpisode ? /*#__PURE__*/React.createElement(EpisodeFields, {
    form: form,
    set: set,
    nextEpisode: nextEpisode
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SectionTitle, {
    icon: "info"
  }, "Basic info"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 2
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Title"
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: form.title,
    onChange: v => set({
      title: v
    }),
    placeholder: "Your title's name"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Year"
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: form.year,
    onChange: v => set({
      year: v.replace(/[^0-9]/g, '').slice(0, 4)
    }),
    placeholder: "2025",
    mono: true
  })))), series ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Seasons"
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: form.seasons,
    onChange: v => set({
      seasons: v.replace(/[^0-9]/g, '').slice(0, 3)
    }),
    placeholder: "1",
    mono: true
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Episodes"
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: form.episodes,
    onChange: v => set({
      episodes: v.replace(/[^0-9]/g, '').slice(0, 4)
    }),
    placeholder: "8",
    mono: true
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Episode length"
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: form.duration,
    onChange: v => set({
      duration: v
    }),
    placeholder: "44m"
  })))) : /*#__PURE__*/React.createElement(Field, {
    label: "Duration",
    hint: "Runtime in plain form, e.g. 45m or 1h30m."
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: form.duration,
    onChange: v => set({
      duration: v
    }),
    placeholder: "1h 42m"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Description / synopsis"
  }, /*#__PURE__*/React.createElement(TextArea, {
    value: form.description,
    onChange: v => set({
      description: v
    }),
    rows: 4,
    placeholder: "What is it about? Keep it spoiler-light."
  }))));
}
function Step2({
  form,
  set
}) {
  const series = form.type === 'series';
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionTitle, {
    icon: "image",
    hint: "The hero photo runs behind the title-page header; the motto sits over it."
  }, "Hero"), /*#__PURE__*/React.createElement(Field, {
    label: "Background photo"
  }, /*#__PURE__*/React.createElement(FileDrop, {
    value: form.heroImage,
    onChange: v => set({
      heroImage: v
    }),
    aspect: "16/9",
    label: "Drop a thematic still, or click to upload",
    sub: "16:9 \xB7 shown at the top of the title page"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Motto (1\u20132 sentences)",
    hint: "A short line or two that appears over the background photo \u2014 shown for every content type."
  }, /*#__PURE__*/React.createElement(TextArea, {
    value: form.motto,
    onChange: v => set({
      motto: v
    }),
    rows: 2,
    placeholder: "One or two sentences that capture the mood\u2026"
  })), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement(SectionTitle, {
    icon: "image"
  }, "Poster & tags"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 150,
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Poster"
  }, /*#__PURE__*/React.createElement(FileDrop, {
    value: form.poster,
    onChange: v => set({
      poster: v
    }),
    aspect: "2/3",
    label: "Upload poster",
    sub: "2:3"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Genre / type tags",
    hint: "Press Enter to add. Sci-Fi, Drama, Animation\u2026"
  }, /*#__PURE__*/React.createElement(TagInput, {
    tags: form.genres,
    onChange: v => set({
      genres: v
    }),
    placeholder: "Add a genre\u2026"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Content tags",
    hint: "Searchable labels \u2014 themes, techniques, moods."
  }, /*#__PURE__*/React.createElement(TagInput, {
    tags: form.contentTags,
    onChange: v => set({
      contentTags: v
    }),
    placeholder: "diffusion, neo-noir, rain\u2026"
  })))), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement(SectionTitle, {
    icon: "play",
    hint: series ? 'Paste an embed per episode.' : 'Paste the player embed code for the film.'
  }, "Playback"), series ? /*#__PURE__*/React.createElement(EpisodeEmbeds, {
    rows: form.episodeEmbeds,
    onChange: v => set({
      episodeEmbeds: v
    })
  }) : /*#__PURE__*/React.createElement(Field, {
    label: "Embed code"
  }, /*#__PURE__*/React.createElement(TextArea, {
    value: form.embed,
    onChange: v => set({
      embed: v
    }),
    rows: 3,
    mono: true,
    placeholder: "<iframe src=\"https://\u2026\" allowfullscreen></iframe>"
  })));
}
function Step3({
  form,
  set
}) {
  const toggleModel = m => set({
    models: form.models.includes(m) ? form.models.filter(x => x !== m) : [...form.models, m]
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionTitle, {
    icon: "users",
    hint: "Who contributed to the production \u2014 director, cast, key roles."
  }, "Crew & credits"), /*#__PURE__*/React.createElement(CrewEditor, {
    rows: form.crew,
    onChange: v => set({
      crew: v
    })
  }), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement(SectionTitle, {
    icon: "sparkles",
    hint: "All production details are optional \u2014 fill in what you can."
  }, "Production info"), /*#__PURE__*/React.createElement(Field, {
    label: "AI models used",
    optional: true,
    hint: "Which models drove the generation. Press Enter to add custom."
  }, /*#__PURE__*/React.createElement(TagInput, {
    tags: form.models,
    onChange: v => set({
      models: v
    }),
    placeholder: "Add a model\u2026"
  }), /*#__PURE__*/React.createElement(SuggestPills, {
    options: AC_MODEL_SUGGESTIONS,
    selected: form.models,
    onToggle: toggleModel
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Budget",
    optional: true
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: form.budget,
    onChange: v => set({
      budget: v
    }),
    placeholder: "$180k",
    mono: true
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Production duration",
    optional: true
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: form.prodDuration,
    onChange: v => set({
      prodDuration: v
    }),
    placeholder: "5 months"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Contributors",
    optional: true
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: form.contributors,
    onChange: v => set({
      contributors: v.replace(/[^0-9]/g, '').slice(0, 5)
    }),
    placeholder: "9",
    mono: true
  })))), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement(SectionTitle, {
    icon: "shield"
  }, "Declaration"), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '6px 0'
    }
  }, /*#__PURE__*/React.createElement(CheckRow, {
    checked: form.agreeRights,
    onChange: v => set({
      agreeRights: v
    })
  }, "I confirm that this is my own work or I have rights to submit it to Dreamwall."), /*#__PURE__*/React.createElement(CheckRow, {
    checked: form.agreeAI,
    onChange: v => set({
      agreeAI: v
    })
  }, "I confirm this content was created with AI assistance (50% or more)."), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      display: 'inline-block',
      marginTop: 10,
      marginLeft: 35,
      font: 'var(--text-body-sm)',
      color: 'var(--teal)',
      textDecoration: 'underline',
      textUnderlineOffset: 3
    }
  }, "By submitting you agree to Dreamwall's content guidelines")));
}

// ---- the episode-only fields (shown when Series + "Add episode" is chosen) ----
// No poster, genre, cast or media steps — those are inherited from the chosen series.
function EpisodeFields({
  form,
  set,
  nextEpisode
}) {
  const sel = AC_MY_SERIES.find(s => s.id === form.existingSeriesId);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionTitle, {
    icon: "television-simple",
    hint: "Search and pick the series this episode belongs to."
  }, "Existing series"), /*#__PURE__*/React.createElement(Field, {
    label: "Your series",
    hint: "Only series you've already added appear here."
  }, /*#__PURE__*/React.createElement(SeriesPicker, {
    value: form.existingSeriesId,
    options: AC_MY_SERIES,
    onChange: id => set({
      existingSeriesId: id
    })
  })), sel ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(InheritedSummary, {
    series: sel
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      margin: '14px 0 4px',
      padding: '11px 14px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--teal-ghost)',
      border: '1px solid rgba(78,205,196,0.3)',
      font: 'var(--text-body-sm)',
      color: 'var(--teal-bright)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check-circle",
    size: 16,
    color: "var(--teal-bright)",
    weight: "fill"
  }), "On submit, this episode is appended to ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--fg-0)',
      margin: '0 3px'
    }
  }, sel.name), " \u2014 Season ", sel.seasons, ", as episode ", nextEpisode, "."), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement(SectionTitle, {
    icon: "info",
    hint: "Only the new episode's own details \u2014 everything above is already saved."
  }, "New episode"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 140,
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Episode #"
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: form.episodeNumber,
    onChange: v => set({
      episodeNumber: v.replace(/[^0-9]/g, '').slice(0, 4)
    }),
    placeholder: String(nextEpisode),
    mono: true
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Episode title"
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: form.title,
    onChange: v => set({
      title: v
    }),
    placeholder: "e.g. The Last Broadcast"
  })))), /*#__PURE__*/React.createElement(Field, {
    label: "Video link or embed code",
    hint: "Paste a public watch URL or a full <iframe> player embed."
  }, /*#__PURE__*/React.createElement(TextArea, {
    value: form.episodeMedia,
    onChange: v => set({
      episodeMedia: v
    }),
    rows: 3,
    mono: true,
    placeholder: 'https://…  —or—  <iframe src="https://…" allowfullscreen></iframe>'
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Episode description",
    optional: true,
    hint: "A short, spoiler-light line about this episode."
  }, /*#__PURE__*/React.createElement(TextArea, {
    value: form.description,
    onChange: v => set({
      description: v
    }),
    rows: 2,
    placeholder: "What happens in this one?"
  }))) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '20px 16px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--bg-0)',
      border: '1px dashed var(--border-strong)',
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-up",
    size: 15,
    color: "var(--fg-3)"
  }), "Pick one of your series above \u2014 then you'll only need the new episode's number, title and link."));
}

// ---- success screen ----
function SubmittedScreen({
  form,
  onAnother
}) {
  const isEpisode = form.type === 'series' && form.seriesMode === 'episode';
  const sel = isEpisode ? AC_MY_SERIES.find(s => s.id === form.existingSeriesId) : null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '60px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 74,
      height: 74,
      borderRadius: '50%',
      margin: '0 auto 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--teal-ghost)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'rgba(78,205,196,0.4)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 34,
    color: "var(--teal-bright)",
    weight: "bold"
  })), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--text-h2)',
      color: 'var(--fg-0)',
      marginBottom: 10
    }
  }, isEpisode ? 'Episode added' : 'Submitted for review'), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-lg)',
      color: 'var(--fg-1)',
      maxWidth: 460,
      margin: '0 auto 28px'
    }
  }, isEpisode && sel ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-0)',
      fontWeight: 600
    }
  }, "Episode ", form.episodeNumber || '—', form.title.trim() ? ` · ${form.title.trim()}` : ''), ' ', "was appended to ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-0)',
      fontWeight: 600
    }
  }, sel.name), " and is in the review queue.") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-0)',
      fontWeight: 600
    }
  }, form.title.trim() || 'Your title'), " is in the queue. We'll ping you once it clears moderation and goes live for users to rate.")), /*#__PURE__*/React.createElement("button", {
    onClick: onAnother,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '12px 22px',
      cursor: 'pointer',
      borderRadius: 'var(--radius-md)',
      border: 'none',
      background: 'var(--coral)',
      color: 'var(--fg-on-accent)',
      font: '600 14px/1 var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 15,
    color: "var(--fg-on-accent)",
    weight: "bold"
  }), " ", isEpisode ? 'Add another episode' : 'Add another title'));
}

// ======================= PAGE =======================
const AC_BLANK = {
  type: 'movie',
  seriesMode: 'new',
  // 'new' = full series form | 'episode' = add to existing series
  existingSeriesId: '',
  episodeNumber: '',
  episodeMedia: '',
  heroImage: null,
  motto: '',
  title: '',
  year: '',
  seasons: '',
  episodes: '',
  duration: '',
  description: '',
  genres: [],
  contentTags: [],
  poster: null,
  embed: '',
  episodeEmbeds: [{
    ep: 'Episode 1',
    embed: ''
  }],
  crew: [{
    role: 'Director',
    name: ''
  }, {
    role: 'Prompt Architect',
    name: ''
  }],
  models: [],
  budget: '',
  prodDuration: '',
  contributors: '',
  agreeRights: false,
  agreeAI: false
};
function AddContent() {
  const [step, setStep] = React.useState(1);
  const [maxStep, setMaxStep] = React.useState(1);
  const [form, setForm] = React.useState(AC_BLANK);
  const [submitted, setSubmitted] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [tried, setTried] = React.useState(false);
  const set = patch => setForm(f => ({
    ...f,
    ...patch
  }));
  const isEpisode = form.type === 'series' && form.seriesMode === 'episode';
  const selSeries = isEpisode ? AC_MY_SERIES.find(s => s.id === form.existingSeriesId) : null;
  const nextEpisode = selSeries ? selSeries.episodes + 1 : 1;
  const goto = n => {
    setStep(n);
    setMaxStep(m => Math.max(m, n));
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  const next = () => {
    if (step === 1 && !form.title.trim()) {
      setTried(true);
      return;
    }
    setTried(false);
    goto(step + 1);
  };
  const back = () => goto(step - 1);

  // ----- episode path validity + submit -----
  const episodeValid = !!(form.existingSeriesId && form.episodeNumber.trim() && form.title.trim() && form.episodeMedia.trim());
  const newCanSubmit = form.agreeRights && form.agreeAI && form.title.trim();
  const submitEpisode = () => {
    if (!episodeValid) {
      setTried(true);
      return;
    }
    setSubmitted(true);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  const submitNew = () => {
    if (!newCanSubmit) {
      setTried(true);
      return;
    }
    setSubmitted(true);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  const reset = () => {
    setForm(AC_BLANK);
    setStep(1);
    setMaxStep(1);
    setSubmitted(false);
    setTried(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh'
    }
  }, /*#__PURE__*/React.createElement(NavBar, {
    active: "",
    onNav: () => {},
    query: query,
    onQuery: setQuery,
    onOpenResult: () => {}
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: '0 auto',
      padding: '40px 28px 90px'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      marginBottom: 30
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      color: 'var(--coral-bright)',
      marginBottom: 10
    }
  }, "Contribute"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--text-h1)',
      color: 'var(--fg-0)',
      letterSpacing: '-0.015em',
      marginBottom: 10
    }
  }, "Add a title to Dreamwall"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-lg)',
      color: 'var(--fg-1)',
      maxWidth: 560
    }
  }, "Submit AI-generated film & series for the community to rate, review and discover.")), submitted ? /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-1)',
      borderRadius: 'var(--radius-xl)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(SubmittedScreen, {
    form: form,
    onAnother: reset
  })) : isEpisode ?
  /*#__PURE__*/
  /* ===== Series → Add episode: compact, single-step episode form (no wizard, no preview) ===== */
  React.createElement("div", {
    style: {
      maxWidth: 760
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-1)',
      borderRadius: 'var(--radius-xl)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'var(--border-subtle)',
      boxShadow: 'var(--shadow-1)',
      padding: '30px 32px'
    }
  }, /*#__PURE__*/React.createElement(Step1, {
    form: form,
    set: set,
    nextEpisode: nextEpisode
  }), tried && !episodeValid && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      marginTop: 20,
      padding: '11px 14px',
      borderRadius: 'var(--radius-md)',
      background: 'rgba(229,72,77,0.1)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'rgba(229,72,77,0.35)',
      font: 'var(--text-body-sm)',
      color: 'var(--score-low)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "warning",
    size: 15,
    color: "var(--score-low)"
  }), "Pick a series and fill in the episode number, title and video link to submit."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 28,
      paddingTop: 24,
      borderTopWidth: 1,
      borderTopStyle: 'solid',
      borderTopColor: 'var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-3)'
    }
  }, "Episode details only"), /*#__PURE__*/React.createElement("button", {
    onClick: submitEpisode,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '11px 20px',
      borderRadius: 'var(--radius-md)',
      border: 'none',
      cursor: episodeValid ? 'pointer' : 'not-allowed',
      font: '600 14px/1 var(--font-body)',
      background: episodeValid ? 'var(--teal)' : 'var(--bg-3)',
      color: episodeValid ? 'var(--fg-on-accent)' : 'var(--fg-3)',
      transition: 'background var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 16,
    color: episodeValid ? 'var(--fg-on-accent)' : 'var(--fg-3)',
    weight: "bold"
  }), " Add episode")))) :
  /*#__PURE__*/
  /* ===== Full submission wizard (film / short / new series) ===== */
  React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Stepper, {
    step: step,
    maxStep: maxStep,
    onJump: goto
  }), /*#__PURE__*/React.createElement("div", {
    className: "ac-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) 332px',
      gap: 44,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-1)',
      borderRadius: 'var(--radius-xl)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'var(--border-subtle)',
      boxShadow: 'var(--shadow-1)',
      padding: '30px 32px'
    }
  }, step === 1 && /*#__PURE__*/React.createElement(Step1, {
    form: form,
    set: set,
    nextEpisode: nextEpisode
  }), step === 2 && /*#__PURE__*/React.createElement(Step2, {
    form: form,
    set: set
  }), step === 3 && /*#__PURE__*/React.createElement(Step3, {
    form: form,
    set: set
  }), tried && (step === 1 && !form.title.trim() || step === 3 && !newCanSubmit) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      marginTop: 20,
      padding: '11px 14px',
      borderRadius: 'var(--radius-md)',
      background: 'rgba(229,72,77,0.1)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'rgba(229,72,77,0.35)',
      font: 'var(--text-body-sm)',
      color: 'var(--score-low)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "warning",
    size: 15,
    color: "var(--score-low)"
  }), step === 1 ? 'A title is required to continue.' : 'Confirm both declarations to submit.'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 28,
      paddingTop: 24,
      borderTopWidth: 1,
      borderTopStyle: 'solid',
      borderTopColor: 'var(--border-subtle)'
    }
  }, step > 1 ? /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    icon: "chevron-left",
    onClick: back
  }, "Back") : /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-3)'
    }
  }, "Step ", step, " of 3"), step < 3 ? /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: next
  }, "Continue") : /*#__PURE__*/React.createElement("button", {
    onClick: submitNew,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '11px 20px',
      borderRadius: 'var(--radius-md)',
      border: 'none',
      cursor: newCanSubmit ? 'pointer' : 'not-allowed',
      font: '600 14px/1 var(--font-body)',
      background: newCanSubmit ? 'var(--coral)' : 'var(--bg-3)',
      color: newCanSubmit ? 'var(--fg-on-accent)' : 'var(--fg-3)',
      transition: 'background var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 16,
    color: newCanSubmit ? 'var(--fg-on-accent)' : 'var(--fg-3)',
    weight: "bold"
  }), " Submit title"))), /*#__PURE__*/React.createElement(LivePreview, {
    form: form
  })))));
}
Object.assign(window, {
  AddContent,
  Stepper
});
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(AddContent, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/AddContent.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/AddContentFields.jsx
try { (() => {
// Dreamwall UI kit — Add Content form field primitives
// Shared inputs, tag inputs, file drop, crew editor, checkboxes, dividers.

const AC_INPUT = {
  width: '100%',
  background: 'var(--bg-0)',
  color: 'var(--fg-0)',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'var(--border-subtle)',
  borderRadius: 'var(--radius-md)',
  padding: '11px 14px',
  font: 'var(--text-body)',
  outline: 'none',
  transition: 'border-color var(--dur-fast), box-shadow var(--dur-fast)'
};

// ---- labelled field wrapper ----
function Field({
  label,
  hint,
  optional,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  }, label && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 13px/1 var(--font-body)',
      color: 'var(--fg-0)'
    }
  }, label), optional && /*#__PURE__*/React.createElement("span", {
    className: "overline",
    style: {
      color: 'var(--fg-3)'
    }
  }, "Optional")), children, hint && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)',
      marginTop: 7
    }
  }, hint));
}

// ---- text input ----
function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  mono
}) {
  const [f, setF] = React.useState(false);
  return /*#__PURE__*/React.createElement("input", {
    type: type,
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value),
    onFocus: () => setF(true),
    onBlur: () => setF(false),
    style: {
      ...AC_INPUT,
      fontFamily: mono ? 'var(--font-mono)' : undefined,
      borderColor: f ? 'var(--border-accent)' : 'var(--border-subtle)',
      boxShadow: f ? 'var(--glow-coral)' : 'none'
    }
  });
}

// ---- textarea ----
function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
  mono
}) {
  const [f, setF] = React.useState(false);
  return /*#__PURE__*/React.createElement("textarea", {
    value: value,
    placeholder: placeholder,
    rows: rows,
    onChange: e => onChange(e.target.value),
    onFocus: () => setF(true),
    onBlur: () => setF(false),
    style: {
      ...AC_INPUT,
      resize: 'vertical',
      minHeight: rows * 22,
      lineHeight: 1.55,
      fontFamily: mono ? 'var(--font-mono)' : undefined,
      fontSize: mono ? 13 : undefined,
      borderColor: f ? 'var(--border-accent)' : 'var(--border-subtle)',
      boxShadow: f ? 'var(--glow-coral)' : 'none'
    }
  });
}

// ---- removable chip ----
function Chip({
  label,
  onRemove
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      padding: '5px 6px 5px 11px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--bg-2)',
      border: '1px solid var(--border-default)',
      font: '600 12.5px/1 var(--font-body)',
      color: 'var(--fg-0)'
    }
  }, label, /*#__PURE__*/React.createElement("span", {
    onClick: onRemove,
    style: {
      cursor: 'pointer',
      display: 'flex',
      borderRadius: '50%',
      padding: 1
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--bg-3)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 12,
    color: "var(--fg-2)"
  })));
}

// ---- tag input (type + Enter to add) ----
function TagInput({
  tags,
  onChange,
  placeholder
}) {
  const [val, setVal] = React.useState('');
  const [f, setF] = React.useState(false);
  const add = t => {
    t = t.trim().replace(/,$/, '');
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setVal('');
  };
  const remove = t => onChange(tags.filter(x => x !== t));
  return /*#__PURE__*/React.createElement("div", {
    onClick: e => {
      const inp = e.currentTarget.querySelector('input');
      inp && inp.focus();
    },
    style: {
      ...AC_INPUT,
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      alignItems: 'center',
      padding: '8px 10px',
      cursor: 'text',
      borderColor: f ? 'var(--border-accent)' : 'var(--border-subtle)',
      boxShadow: f ? 'var(--glow-coral)' : 'none'
    }
  }, tags.map(t => /*#__PURE__*/React.createElement(Chip, {
    key: t,
    label: t,
    onRemove: () => remove(t)
  })), /*#__PURE__*/React.createElement("input", {
    value: val,
    placeholder: tags.length ? '' : placeholder,
    onChange: e => setVal(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        add(val);
      } else if (e.key === 'Backspace' && !val && tags.length) remove(tags[tags.length - 1]);
    },
    onFocus: () => setF(true),
    onBlur: () => {
      setF(false);
      add(val);
    },
    style: {
      flex: 1,
      minWidth: 90,
      background: 'none',
      border: 'none',
      outline: 'none',
      color: 'var(--fg-0)',
      font: 'var(--text-body)'
    }
  }));
}

// ---- quick-add suggestion pills (for AI models) ----
function SuggestPills({
  options,
  selected,
  onToggle
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 10
    }
  }, options.map(o => {
    const on = selected.includes(o);
    return /*#__PURE__*/React.createElement("button", {
      key: o,
      onClick: () => onToggle(o),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        cursor: 'pointer',
        padding: '6px 11px',
        borderRadius: 'var(--radius-pill)',
        font: '600 12px/1 var(--font-body)',
        background: on ? 'var(--teal-ghost)' : 'transparent',
        color: on ? 'var(--teal-bright)' : 'var(--fg-1)',
        border: '1px solid ' + (on ? 'rgba(78,205,196,0.4)' : 'var(--border-subtle)'),
        transition: 'all var(--dur-fast)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: on ? 'check' : 'plus',
      size: 12,
      color: on ? 'var(--teal-bright)' : 'var(--fg-2)'
    }), o);
  }));
}

// ---- image upload / drop zone ----
function FileDrop({
  value,
  onChange,
  aspect = '16/9',
  label,
  sub
}) {
  const inputRef = React.useRef(null);
  const [hover, setHover] = React.useState(false);
  const pick = file => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => onChange(r.result);
    r.readAsDataURL(file);
  };
  return /*#__PURE__*/React.createElement("div", {
    onClick: () => inputRef.current.click(),
    onDragOver: e => {
      e.preventDefault();
      setHover(true);
    },
    onDragLeave: () => setHover(false),
    onDrop: e => {
      e.preventDefault();
      setHover(false);
      pick(e.dataTransfer.files[0]);
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      aspectRatio: aspect,
      borderRadius: 'var(--radius-lg)',
      cursor: 'pointer',
      overflow: 'hidden',
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: hover ? 'var(--border-accent)' : 'var(--border-strong)',
      background: value ? 'var(--bg-inset)' : 'var(--bg-0)',
      transition: 'border-color var(--dur-fast)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, value ? /*#__PURE__*/React.createElement("img", {
    src: value,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "upload-simple",
    size: 26,
    color: hover ? 'var(--coral-bright)' : 'var(--fg-2)'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 13px/1.3 var(--font-body)',
      color: 'var(--fg-1)'
    }
  }, label), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-3)',
      marginTop: 6,
      letterSpacing: '0.04em'
    }
  }, sub)), value && /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onChange(null);
    },
    style: {
      position: 'absolute',
      top: 9,
      right: 9,
      display: 'flex',
      padding: 7,
      borderRadius: '50%',
      cursor: 'pointer',
      background: 'rgba(10,10,10,0.62)',
      border: '1px solid var(--border-default)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 14,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    type: "file",
    accept: "image/*",
    style: {
      display: 'none'
    },
    onChange: e => pick(e.target.files[0])
  }));
}

// ---- checkbox row ----
function CheckRow({
  checked,
  onChange,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: () => onChange(!checked),
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 13,
      cursor: 'pointer',
      padding: '9px 0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 22,
      flex: 'none',
      borderRadius: 'var(--radius-sm)',
      marginTop: 1,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: checked ? 'transparent' : 'var(--border-strong)',
      background: checked ? 'var(--coral)' : 'var(--bg-0)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all var(--dur-fast)'
    }
  }, checked && /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 14,
    color: "var(--fg-on-accent)",
    weight: "bold"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-body)',
      color: 'var(--fg-1)'
    }
  }, children));
}

// ---- thin section divider ----
function Divider({
  space = 26
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'var(--border-subtle)',
      margin: `${space}px 0`
    }
  });
}

// ---- section heading inside a step ----
function SectionTitle({
  children,
  icon,
  hint
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, icon && /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 16,
    color: "var(--coral)"
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      font: '600 15px/1 var(--font-body)',
      color: 'var(--fg-0)',
      letterSpacing: '0.04em',
      textTransform: 'uppercase'
    }
  }, children)), hint && /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)',
      margin: '8px 0 0'
    }
  }, hint));
}

// ---- content-type selector cards (Film / Series / Short) ----
function TypeCard({
  active,
  onClick,
  icon,
  label,
  sub
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      flex: 1,
      textAlign: 'left',
      cursor: 'pointer',
      padding: '17px 17px',
      borderRadius: 'var(--radius-lg)',
      background: active ? 'var(--coral-ghost)' : h ? 'var(--bg-2)' : 'var(--bg-0)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: active ? 'var(--border-accent)' : 'var(--border-subtle)',
      transition: 'border-color var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 24,
    color: active ? 'var(--coral)' : 'var(--fg-1)'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 15px/1 var(--font-body)',
      color: 'var(--fg-0)',
      marginTop: 13
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)',
      marginTop: 5
    }
  }, sub));
}
function TypeSelector({
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(TypeCard, {
    active: value === 'movie',
    onClick: () => onChange('movie'),
    icon: "film",
    label: "Film",
    sub: "Feature or standalone"
  }), /*#__PURE__*/React.createElement(TypeCard, {
    active: value === 'series',
    onClick: () => onChange('series'),
    icon: "tv",
    label: "Series",
    sub: "Seasons & episodes"
  }), /*#__PURE__*/React.createElement(TypeCard, {
    active: value === 'short',
    onClick: () => onChange('short'),
    icon: "clapperboard",
    label: "Short",
    sub: "Under ~40 minutes"
  }));
}

// ---- repeatable crew / credit rows ----
function CrewEditor({
  rows,
  onChange
}) {
  const update = (i, k, v) => onChange(rows.map((r, j) => j === i ? {
    ...r,
    [k]: v
  } : r));
  const add = () => onChange([...rows, {
    role: '',
    name: ''
  }]);
  const remove = i => onChange(rows.filter((_, j) => j !== i));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, rows.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 180,
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: r.role,
    onChange: v => update(i, 'role', v),
    placeholder: "Role (e.g. Director)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: r.name,
    onChange: v => update(i, 'name', v),
    placeholder: "Name or @handle"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => remove(i),
    title: "Remove",
    style: {
      flex: 'none',
      display: 'flex',
      padding: 11,
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      background: 'transparent',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'var(--border-subtle)'
    },
    onMouseEnter: e => e.currentTarget.style.borderColor = 'var(--border-strong)',
    onMouseLeave: e => e.currentTarget.style.borderColor = 'var(--border-subtle)'
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trash",
    size: 15,
    color: "var(--fg-2)"
  })))), /*#__PURE__*/React.createElement("button", {
    onClick: add,
    style: {
      alignSelf: 'flex-start',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      cursor: 'pointer',
      padding: '10px 15px',
      borderRadius: 'var(--radius-md)',
      background: 'transparent',
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: 'var(--border-strong)',
      font: '600 13px/1 var(--font-body)',
      color: 'var(--fg-1)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 14,
    color: "var(--fg-1)"
  }), " Add credit"));
}

// ---- per-episode embed rows (series) ----
function EpisodeEmbeds({
  rows,
  onChange
}) {
  const update = (i, k, v) => onChange(rows.map((r, j) => j === i ? {
    ...r,
    [k]: v
  } : r));
  const add = () => onChange([...rows, {
    ep: 'Episode ' + (rows.length + 1),
    embed: ''
  }]);
  const remove = i => onChange(rows.filter((_, j) => j !== i));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, rows.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: '14px 16px',
      background: 'var(--bg-0)',
      borderRadius: 'var(--radius-md)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "play",
    size: 14,
    color: "var(--fg-2)"
  }), /*#__PURE__*/React.createElement("input", {
    value: r.ep,
    onChange: e => update(i, 'ep', e.target.value),
    style: {
      flex: 1,
      background: 'none',
      border: 'none',
      outline: 'none',
      color: 'var(--fg-0)',
      font: '600 14px/1 var(--font-body)'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => remove(i),
    title: "Remove episode",
    style: {
      display: 'flex',
      padding: 4,
      background: 'none',
      border: 'none',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trash",
    size: 14,
    color: "var(--fg-2)"
  }))), /*#__PURE__*/React.createElement(TextArea, {
    value: r.embed,
    onChange: v => update(i, 'embed', v),
    rows: 2,
    mono: true,
    placeholder: "<iframe src=\"\u2026\"></iframe>"
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: add,
    style: {
      alignSelf: 'flex-start',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      cursor: 'pointer',
      padding: '10px 15px',
      borderRadius: 'var(--radius-md)',
      background: 'transparent',
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: 'var(--border-strong)',
      font: '600 13px/1 var(--font-body)',
      color: 'var(--fg-1)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 14,
    color: "var(--fg-1)"
  }), " Add episode"));
}

// ---- the user's previously-added series (for "add episode to existing series") ----
const AC_MY_SERIES = [{
  id: 'echoes',
  name: 'Echoes of Tomorrow',
  g: ['#10302d', '#4ecdc4'],
  genres: ['Sci-Fi', 'Drama'],
  seasons: 3,
  episodes: 24,
  description: 'Across three timelines, a family keeps almost meeting itself — an aching, generation-spanning epic rendered entirely in latent space.'
}, {
  id: 'glass',
  name: 'Glass Orchard',
  g: ['#0f2e2b', '#3aa9a1'],
  genres: ['Mystery', 'Drama'],
  seasons: 1,
  episodes: 8,
  description: 'In a town where the trees grow glass fruit, a botanist investigates why the harvest has started showing faces.'
}, {
  id: 'quiet',
  name: 'The Quiet Sequence',
  g: ['#241a3a', '#7c6fe0'],
  genres: ['Sci-Fi', 'Thriller'],
  seasons: 4,
  episodes: 32,
  description: 'A research station listens to a signal that only repeats when nobody is awake to hear it.'
}];

// ---- Series submission mode: brand-new series vs. add an episode to an existing one ----
function SeriesModeCard({
  active,
  onClick,
  icon,
  label,
  sub
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      flex: 1,
      textAlign: 'left',
      cursor: 'pointer',
      padding: '16px 16px',
      borderRadius: 'var(--radius-lg)',
      position: 'relative',
      background: active ? 'var(--coral-ghost)' : h ? 'var(--bg-2)' : 'var(--bg-0)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: active ? 'var(--border-accent)' : 'var(--border-subtle)',
      transition: 'border-color var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      flex: 'none',
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: active ? 'var(--coral)' : 'var(--bg-2)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 19,
    color: active ? 'var(--fg-on-accent)' : 'var(--fg-1)'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 14.5px/1.2 var(--font-body)',
      color: 'var(--fg-0)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)',
      marginTop: 4
    }
  }, sub))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 14,
      right: 14,
      width: 18,
      height: 18,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: active ? 'transparent' : 'var(--border-strong)',
      background: active ? 'var(--coral)' : 'transparent'
    }
  }, active && /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 11,
    color: "var(--fg-on-accent)",
    weight: "bold"
  })));
}

// ---- Series submission mode: brand-new series vs. add an episode to an existing one.
// Appears directly below the Content Type selector, only when "Series" is chosen. ----
function SeriesModeSelector({
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(SeriesModeCard, {
    active: value === 'new',
    onClick: () => onChange('new'),
    icon: "plus-circle",
    label: "New series",
    sub: "Add a brand-new series from scratch."
  }), /*#__PURE__*/React.createElement(SeriesModeCard, {
    active: value === 'episode',
    onClick: () => onChange('episode'),
    icon: "television-simple",
    label: "Add episode to existing series",
    sub: "Pick one of your series and add just the new episode."
  }));
}

// ---- searchable dropdown to pick one of the user's existing series ----
function SeriesPosterChip({
  series,
  size = 34
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: Math.round(size * 1.34),
      flex: 'none',
      borderRadius: 'var(--radius-sm)',
      overflow: 'hidden',
      background: `linear-gradient(150deg, ${series.g[0]}, ${series.g[1]} 150%)`,
      boxShadow: 'var(--shadow-1)'
    }
  });
}
function SeriesPicker({
  value,
  options,
  onChange
}) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState('');
  const searchRef = React.useRef(null);
  const sel = options.find(o => o.id === value);
  React.useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus();
  }, [open]);
  const filtered = options.filter(o => o.name.toLowerCase().includes(q.trim().toLowerCase()));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(o => !o),
    style: {
      ...AC_INPUT,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      cursor: 'pointer',
      textAlign: 'left',
      padding: '9px 12px',
      borderColor: open ? 'var(--border-accent)' : 'var(--border-subtle)',
      boxShadow: open ? 'var(--glow-coral)' : 'none'
    }
  }, sel ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SeriesPosterChip, {
    series: sel,
    size: 30
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      font: '600 14px/1.2 var(--font-body)',
      color: 'var(--fg-0)'
    }
  }, sel.name), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)',
      marginTop: 2
    }
  }, sel.seasons, " ", sel.seasons === 1 ? 'season' : 'seasons', " \xB7 ", sel.episodes, " episodes"))) : /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      color: 'var(--fg-3)',
      font: 'var(--text-body)'
    }
  }, "Search your series\u2026"), /*#__PURE__*/React.createElement(Icon, {
    name: "caret-down",
    size: 15,
    color: "var(--fg-2)"
  })), open && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: () => {
      setOpen(false);
      setQ('');
    },
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 30
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 'calc(100% + 6px)',
      left: 0,
      right: 0,
      zIndex: 31,
      padding: 6,
      background: 'var(--bg-2)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 11,
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "magnifying-glass",
    size: 15,
    color: "var(--fg-3)"
  })), /*#__PURE__*/React.createElement("input", {
    ref: searchRef,
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Search your series\u2026",
    style: {
      width: '100%',
      font: 'var(--text-body)',
      color: 'var(--fg-0)',
      background: 'var(--bg-0)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-sm)',
      padding: '9px 12px 9px 34px',
      outline: 'none'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: 248,
      overflowY: 'auto'
    }
  }, filtered.length ? filtered.map(o => {
    const on = o.id === value;
    return /*#__PURE__*/React.createElement("button", {
      key: o.id,
      onClick: () => {
        onChange(o.id);
        setOpen(false);
        setQ('');
      },
      style: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '9px 10px',
        cursor: 'pointer',
        textAlign: 'left',
        borderRadius: 'var(--radius-sm)',
        border: 'none',
        background: on ? 'var(--coral-ghost)' : 'transparent',
        transition: 'background var(--dur-fast)'
      },
      onMouseEnter: e => {
        if (!on) e.currentTarget.style.background = 'var(--bg-3)';
      },
      onMouseLeave: e => {
        if (!on) e.currentTarget.style.background = 'transparent';
      }
    }, /*#__PURE__*/React.createElement(SeriesPosterChip, {
      series: o,
      size: 30
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        font: '600 14px/1.2 var(--font-body)',
        color: 'var(--fg-0)'
      }
    }, o.name), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        font: 'var(--text-data-sm)',
        color: 'var(--fg-2)',
        marginTop: 2
      }
    }, o.seasons, " ", o.seasons === 1 ? 'season' : 'seasons', " \xB7 ", o.episodes, " episodes")), on && /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 15,
      color: "var(--coral)",
      weight: "bold"
    }));
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 10px',
      textAlign: 'center',
      font: 'var(--text-body-sm)',
      color: 'var(--fg-3)'
    }
  }, "No series match \u201C", q, "\u201D.")))));
}

// ---- read-only summary of the info inherited from the chosen series ----
function InheritedSummary({
  series
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      padding: '16px',
      background: 'var(--bg-0)',
      borderRadius: 'var(--radius-lg)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(SeriesPosterChip, {
    series: series,
    size: 64
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 16px/1.2 var(--font-display)',
      color: 'var(--fg-0)'
    }
  }, series.name), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      font: '600 9px/1 var(--font-body)',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      color: 'var(--teal-bright)',
      background: 'var(--teal-ghost)',
      padding: '4px 8px',
      borderRadius: 'var(--radius-pill)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 10,
    color: "var(--teal-bright)",
    weight: "bold"
  }), " Inherited")), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-1)',
      margin: '8px 0 10px',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    }
  }, series.description), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 7,
      flexWrap: 'wrap'
    }
  }, series.genres.map(g => /*#__PURE__*/React.createElement("span", {
    key: g,
    style: {
      font: '600 11px/1 var(--font-body)',
      color: 'var(--fg-1)',
      background: 'var(--bg-2)',
      border: '1px solid var(--border-subtle)',
      padding: '5px 9px',
      borderRadius: 'var(--radius-pill)'
    }
  }, g))), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-3)',
      marginTop: 11
    }
  }, "Series name, description, poster & genre carry over automatically \u2014 no need to re-enter.")));
}
Object.assign(window, {
  AC_INPUT,
  Field,
  TextInput,
  TextArea,
  Chip,
  TagInput,
  SuggestPills,
  FileDrop,
  CheckRow,
  Divider,
  SectionTitle,
  TypeCard,
  TypeSelector,
  CrewEditor,
  EpisodeEmbeds,
  AC_MY_SERIES,
  SeriesModeSelector,
  SeriesPicker,
  InheritedSummary,
  SeriesPosterChip
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/AddContentFields.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/AddContentPreview.jsx
try { (() => {
// Dreamwall UI kit — Add Content live preview panel.
// Mirrors the title-page header + content card in real time as the form fills in.

function PreviewPosterPlaceholder({
  color
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: `repeating-linear-gradient(135deg, ${color}22 0 10px, transparent 10px 20px), linear-gradient(150deg, var(--bg-2), var(--bg-3))`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 10px/1.4 var(--font-mono)',
      color: 'var(--fg-3)',
      letterSpacing: '0.08em',
      textAlign: 'center'
    }
  }, "POSTER", /*#__PURE__*/React.createElement("br", null), "2 : 3"));
}
function LivePreview({
  form
}) {
  const t = window.AICDB_TYPES[form.type] || window.AICDB_TYPES.movie;
  const g0 = '#1a1714';
  const title = form.title.trim() || 'Untitled';
  const year = form.year.trim() || '—';
  const motto = form.motto.trim();
  const heroBg = form.heroImage ? `url(${form.heroImage}) center/cover` : `linear-gradient(150deg, ${g0}, ${t.color} 180%)`;
  const posterBg = form.poster ? `url(${form.poster}) center/cover` : null;
  return /*#__PURE__*/React.createElement("aside", {
    className: "ac-preview",
    style: {
      position: 'sticky',
      top: 88,
      alignSelf: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: 'var(--coral)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "overline",
    style: {
      color: 'var(--fg-1)'
    }
  }, "Live preview")), /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      background: 'var(--bg-1)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'var(--border-subtle)',
      boxShadow: 'var(--shadow-2)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 158,
      background: heroBg
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to bottom, rgba(10,10,10,0.18) 0%, rgba(10,10,10,0.55) 55%, rgba(21,21,20,0.96) 100%)'
    }
  }), motto && /*#__PURE__*/React.createElement("blockquote", {
    style: {
      position: 'absolute',
      right: 16,
      left: 16,
      bottom: 60,
      margin: 0,
      textAlign: 'right',
      fontFamily: '"Times New Roman", Times, serif',
      fontStyle: 'italic',
      fontWeight: 400,
      fontSize: 16,
      lineHeight: 1.3,
      color: 'rgba(245,243,239,0.94)',
      textShadow: '0 2px 14px rgba(0,0,0,0.75)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 26,
      lineHeight: 0,
      verticalAlign: '-0.3em',
      opacity: 0.5,
      marginRight: 2
    }
  }, "\u201C"), motto), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 16,
      right: 16,
      bottom: 14
    }
  }, /*#__PURE__*/React.createElement(ContentBadge, {
    type: form.type,
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 21px/1.12 var(--font-display)',
      color: 'var(--fg-0)',
      letterSpacing: '-0.01em',
      marginTop: 9,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, title))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '13px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      flexWrap: 'wrap',
      font: 'var(--text-data-sm)',
      color: 'var(--fg-1)'
    }
  }, /*#__PURE__*/React.createElement("span", null, year), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-3)'
    }
  }, "\xB7"), form.type === 'series' ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--teal-bright)'
    }
  }, form.seasons || '—', " ", form.seasons === '1' ? 'season' : 'seasons', " \xB7 ", form.episodes || '—', " eps") : /*#__PURE__*/React.createElement("span", null, form.duration.trim() || '—'), form.genres.slice(0, 2).map(gn => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-3)'
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    key: gn
  }, gn))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      color: 'var(--fg-2)',
      marginBottom: 12
    }
  }, "Card in the grid"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 152
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: '2/3',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      position: 'relative',
      boxShadow: 'var(--shadow-poster)',
      background: posterBg || 'transparent'
    }
  }, !posterBg && /*#__PURE__*/React.createElement(PreviewPosterPlaceholder, {
    color: t.color
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 9,
      left: 9
    }
  }, /*#__PURE__*/React.createElement(ContentBadge, {
    type: form.type,
    solid: true,
    size: "sm"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      padding: '22px 10px 10px',
      background: 'linear-gradient(to top, rgba(0,0,0,0.82), transparent)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      font: '600 10px/1 var(--font-mono)',
      letterSpacing: '0.05em',
      color: 'rgba(255,255,255,0.82)',
      textTransform: 'uppercase'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'var(--fg-2)'
    }
  }), "Not yet rated"))), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 13.5px/1.25 var(--font-body)',
      color: 'var(--fg-0)',
      marginTop: 9,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)',
      marginTop: 3
    }
  }, year))), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-3)',
      margin: '22px 0 0',
      maxWidth: 300
    }
  }, "This is how your title will appear across Dreamwall. Posters use a 2:3 ratio; the hero photo runs full-bleed behind the motto."));
}
Object.assign(window, {
  LivePreview,
  PreviewPosterPlaceholder
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/AddContentPreview.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/Admin.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Dreamwall — Admin Panel: shell (sidebar + topbar), shared admin UI primitives,
// and the Dashboard page. Reuses Primitives (Icon, Avatar, Logo, fmtCount).

// ============================================================
// Shared admin primitives
// ============================================================
const ADMIN_NAV = [{
  id: 'Dashboard',
  icon: 'squares-four'
}, {
  id: 'Content',
  icon: 'film-slate'
}, {
  id: 'Users',
  icon: 'users'
}, {
  id: 'Badges',
  icon: 'medal'
}, {
  id: 'Reports',
  icon: 'flag'
}, {
  id: 'Statistics',
  icon: 'chart-line-up'
}, {
  id: 'Settings',
  icon: 'gear'
}];
function statusColor(s) {
  return {
    pending: 'var(--warning)',
    published: 'var(--success)',
    rejected: 'var(--danger)',
    high: 'var(--danger)',
    medium: 'var(--warning)',
    low: 'var(--fg-1)',
    creator: 'var(--teal)',
    admin: 'var(--coral)',
    viewer: 'var(--fg-1)',
    banned: 'var(--danger)'
  }[s] || 'var(--fg-1)';
}

// status / role pill
function APill({
  label,
  tone = 'var(--fg-1)',
  solid,
  icon
}) {
  const bg = solid ? tone : 'transparent';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '4px 9px',
      borderRadius: 'var(--radius-pill)',
      font: '600 11px/1 var(--font-body)',
      letterSpacing: '0.02em',
      whiteSpace: 'nowrap',
      color: solid ? '#0a0a0a' : tone,
      background: bg,
      border: solid ? 'none' : `1px solid ${tone}55`
    }
  }, icon && /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 11,
    color: solid ? '#0a0a0a' : tone,
    weight: "fill"
  }), label);
}

// admin action button — variants: ghost (default), approve, reject, neutral, primary
function ABtn({
  children,
  icon,
  variant = 'ghost',
  size = 'sm',
  onClick,
  disabled
}) {
  const [hover, setHover] = React.useState(false);
  const pads = size === 'xs' ? '6px 10px' : '8px 13px';
  const fs = size === 'xs' ? 12 : 13;
  const palette = {
    ghost: {
      bg: 'transparent',
      bgH: 'var(--bg-3)',
      bd: 'var(--border-default)',
      fg: 'var(--fg-1)',
      fgH: 'var(--fg-0)'
    },
    approve: {
      bg: 'var(--teal-ghost)',
      bgH: 'rgba(78,205,196,0.22)',
      bd: 'rgba(78,205,196,0.4)',
      fg: 'var(--teal-bright)',
      fgH: 'var(--teal-bright)'
    },
    reject: {
      bg: 'rgba(229,72,77,0.12)',
      bgH: 'rgba(229,72,77,0.22)',
      bd: 'rgba(229,72,77,0.4)',
      fg: '#f0686c',
      fgH: '#f0686c'
    },
    warn: {
      bg: 'rgba(229,178,59,0.12)',
      bgH: 'rgba(229,178,59,0.22)',
      bd: 'rgba(229,178,59,0.4)',
      fg: 'var(--warning)',
      fgH: 'var(--warning)'
    },
    primary: {
      bg: 'var(--coral)',
      bgH: 'var(--coral-bright)',
      bd: 'transparent',
      fg: 'var(--fg-on-accent)',
      fgH: 'var(--fg-on-accent)'
    },
    neutral: {
      bg: 'var(--bg-3)',
      bgH: 'var(--border-strong)',
      bd: 'var(--border-default)',
      fg: 'var(--fg-0)',
      fgH: 'var(--fg-0)'
    }
  }[variant];
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: pads,
      borderRadius: 'var(--radius-md)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      font: `600 ${fs}px/1 var(--font-body)`,
      background: hover ? palette.bgH : palette.bg,
      border: `1px solid ${palette.bd}`,
      color: hover ? palette.fgH : palette.fg,
      transition: 'all var(--dur-fast)',
      whiteSpace: 'nowrap'
    }
  }, icon && /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: fs + 2,
    color: "currentColor"
  }), children);
}

// segmented tabs (count badges optional)
function ATabs({
  tabs,
  active,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      gap: 4,
      padding: 4,
      background: 'var(--bg-1)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-subtle)'
    }
  }, tabs.map(t => {
    const on = active === t.id;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: () => onChange(t.id),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 15px',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        font: '600 13.5px/1 var(--font-body)',
        border: 'none',
        transition: 'all var(--dur-fast)',
        background: on ? 'var(--bg-3)' : 'transparent',
        color: on ? 'var(--fg-0)' : 'var(--fg-2)'
      }
    }, t.label, t.count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 11px/1 var(--font-mono)',
        padding: '3px 6px',
        borderRadius: 'var(--radius-pill)',
        background: on ? t.tone || 'var(--coral)' : 'var(--bg-3)',
        color: on ? '#0a0a0a' : 'var(--fg-2)'
      }
    }, t.count));
  }));
}

// toggle switch
function AToggle({
  on,
  onChange
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => onChange(!on),
    role: "switch",
    "aria-checked": on,
    style: {
      width: 44,
      height: 25,
      borderRadius: 'var(--radius-pill)',
      border: 'none',
      cursor: 'pointer',
      padding: 3,
      background: on ? 'var(--teal)' : 'var(--bg-3)',
      transition: 'background var(--dur-base)',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      width: 19,
      height: 19,
      borderRadius: '50%',
      background: '#0a0a0a',
      transform: on ? 'translateX(19px)' : 'translateX(0)',
      transition: 'transform var(--dur-base) var(--ease-out)'
    }
  }));
}

// thumbnail (poster) for tables
function AThumb({
  g,
  type,
  w = 40
}) {
  const aspect = type === 'vertical' ? '9/16' : '2/3';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: w,
      aspectRatio: aspect,
      flex: 'none',
      borderRadius: 6,
      overflow: 'hidden',
      background: `linear-gradient(150deg, ${g[0]}, ${g[1]} 150%)`,
      boxShadow: 'var(--shadow-1)'
    }
  });
}

// search input
function ASearch({
  value,
  onChange,
  placeholder
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      background: 'var(--bg-1)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      padding: '9px 13px',
      minWidth: 240
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "magnifying-glass",
    size: 15,
    color: "var(--fg-2)"
  }), /*#__PURE__*/React.createElement("input", {
    value: value,
    onChange: e => onChange(e.target.value),
    placeholder: placeholder,
    style: {
      background: 'none',
      border: 'none',
      outline: 'none',
      color: 'var(--fg-0)',
      font: 'var(--text-body-sm)',
      width: '100%'
    }
  }));
}

// confirmation / reason modal
function AReasonModal({
  title,
  sub,
  label,
  placeholder,
  confirmLabel,
  confirmVariant = 'reject',
  requireText,
  onConfirm,
  onClose
}) {
  const [text, setText] = React.useState('');
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 400,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(5,5,5,0.74)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: '100%',
      maxWidth: 440,
      background: 'var(--bg-1)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-3)',
      padding: '26px 26px 22px'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      font: 'var(--text-h3)',
      color: 'var(--fg-0)',
      margin: '0 0 6px'
    }
  }, title), sub && /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)',
      margin: '0 0 18px'
    }
  }, sub), label && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
    className: "overline",
    style: {
      color: 'var(--fg-2)',
      display: 'block',
      marginBottom: 8
    }
  }, label), /*#__PURE__*/React.createElement("textarea", {
    value: text,
    onChange: e => setText(e.target.value),
    rows: 3,
    placeholder: placeholder,
    style: {
      width: '100%',
      resize: 'vertical',
      background: 'var(--bg-0)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      padding: '11px 13px',
      color: 'var(--fg-0)',
      font: 'var(--text-body)',
      outline: 'none'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10,
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(ABtn, {
    variant: "ghost",
    size: "sm",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement(ABtn, {
    variant: confirmVariant,
    size: "sm",
    disabled: requireText && !text.trim(),
    onClick: () => {
      onConfirm(text);
      onClose();
    }
  }, confirmLabel))));
}

// toast
function AToast({
  msg,
  onClose
}) {
  React.useEffect(() => {
    const t = setTimeout(onClose, 2600);
    return () => clearTimeout(t);
  }, [msg]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      left: '50%',
      bottom: 30,
      transform: 'translateX(-50%)',
      zIndex: 500,
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      padding: '13px 20px',
      background: 'var(--bg-2)',
      border: '1px solid var(--border-strong)',
      borderRadius: 'var(--radius-pill)',
      boxShadow: 'var(--shadow-3)',
      animation: 'aicdbCardIn 0.35s var(--ease-out) both'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check-circle",
    size: 18,
    color: "var(--teal-bright)",
    weight: "fill"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 14px/1 var(--font-body)',
      color: 'var(--fg-0)'
    }
  }, msg));
}

// page header
function APageHead({
  title,
  sub,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 20,
      flexWrap: 'wrap',
      marginBottom: 26
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: '600 28px/1.1 var(--font-display)',
      color: 'var(--fg-0)',
      letterSpacing: '-0.01em',
      margin: 0
    }
  }, title), sub && /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)',
      margin: '7px 0 0'
    }
  }, sub)), children && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, children));
}

// card wrapper
function ACard({
  children,
  style,
  pad = 22
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: pad,
      ...style
    }
  }, children);
}

// ============================================================
// Dashboard
// ============================================================
function StatCard({
  icon,
  label,
  value,
  delta,
  tone,
  alert
}) {
  return /*#__PURE__*/React.createElement(ACard, {
    pad: 20,
    style: {
      position: 'relative',
      overflow: 'hidden'
    }
  }, alert && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 16,
      right: 16,
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: tone,
      boxShadow: `0 0 8px ${tone}`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `${tone}1f`
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 18,
    color: tone,
    weight: "fill"
  })), /*#__PURE__*/React.createElement("span", {
    className: "overline",
    style: {
      color: 'var(--fg-2)'
    }
  }, label)), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 30px/1 var(--font-mono)',
      color: 'var(--fg-0)',
      letterSpacing: '-0.01em'
    }
  }, value), delta && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      marginTop: 10,
      font: '600 12px/1 var(--font-mono)',
      color: delta.startsWith('-') ? 'var(--danger)' : 'var(--teal-bright)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: delta.startsWith('-') ? 'trend-down' : 'trend-up',
    size: 13,
    color: "currentColor"
  }), delta, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-3)',
      fontWeight: 500
    }
  }, "vs last week")));
}
function ActivityRow({
  a
}) {
  const cfg = {
    register: {
      icon: 'user-plus',
      tone: 'var(--teal)'
    },
    submission: {
      icon: 'upload-simple',
      tone: 'var(--coral)'
    },
    report: {
      icon: 'flag',
      tone: 'var(--warning)'
    },
    ban: {
      icon: 'prohibit',
      tone: 'var(--danger)'
    }
  }[a.kind];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 13,
      padding: '13px 0',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    size: 36,
    colors: a.av
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: -2,
      right: -2,
      width: 17,
      height: 17,
      borderRadius: '50%',
      background: 'var(--bg-1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: cfg.icon,
    size: 11,
    color: cfg.tone,
    weight: "fill"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-1)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-0)',
      fontWeight: 600
    }
  }, a.who), " ", a.detail)), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-3)',
      flex: 'none'
    }
  }, a.time));
}
function Dashboard({
  onNav
}) {
  const s = window.ADMIN_STATS;
  const cards = [{
    icon: 'users',
    label: 'Total Users',
    value: fmtCount(s.totalUsers),
    delta: '+4.2%',
    tone: 'var(--teal)'
  }, {
    icon: 'film-slate',
    label: 'Total Content',
    value: s.totalContent,
    delta: '+3',
    tone: 'var(--coral)'
  }, {
    icon: 'hourglass-medium',
    label: 'Pending Reviews',
    value: s.pendingReviews,
    tone: 'var(--warning)',
    alert: true
  }, {
    icon: 'pulse',
    label: 'Active Today',
    value: fmtCount(s.activeToday),
    delta: '+1.8%',
    tone: 'var(--info)'
  }, {
    icon: 'star',
    label: 'Total Ratings',
    value: fmtCount(s.totalRatings),
    delta: '+12k',
    tone: 'var(--coral)'
  }, {
    icon: 'flag',
    label: 'Reported Items',
    value: s.reportedItems,
    tone: 'var(--danger)',
    alert: true
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(APageHead, {
    title: "Dashboard",
    sub: "Platform health at a glance \u2014 Saturday, June 3, 2026"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: 16,
      marginBottom: 30
    }
  }, cards.map(c => /*#__PURE__*/React.createElement(StatCard, _extends({
    key: c.label
  }, c)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.6fr 1fr',
      gap: 20,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(ACard, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      font: '600 18px/1 var(--font-display)',
      color: 'var(--fg-0)'
    }
  }, "Recent activity"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      font: 'var(--text-data-sm)',
      color: 'var(--teal-bright)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: 'var(--teal-bright)',
      boxShadow: '0 0 8px rgba(78,205,196,0.9)'
    }
  }), " Live")), window.ADMIN_ACTIVITY.map((a, i) => /*#__PURE__*/React.createElement(ActivityRow, {
    key: i,
    a: a
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(ACard, null, /*#__PURE__*/React.createElement("h3", {
    style: {
      font: '600 18px/1 var(--font-display)',
      color: 'var(--fg-0)',
      marginBottom: 16
    }
  }, "Needs attention"), /*#__PURE__*/React.createElement(QueueRow, {
    icon: "hourglass-medium",
    tone: "var(--warning)",
    label: "Content pending review",
    count: window.ADMIN_STATS.pendingReviews,
    onClick: () => onNav('Content')
  }), /*#__PURE__*/React.createElement(QueueRow, {
    icon: "flag",
    tone: "var(--danger)",
    label: "Open reports",
    count: window.ADMIN_STATS.reportedItems,
    onClick: () => onNav('Reports')
  }), /*#__PURE__*/React.createElement(QueueRow, {
    icon: "prohibit",
    tone: "var(--fg-1)",
    label: "Banned accounts",
    count: window.ADMIN_USERS.filter(u => u.banned).length,
    onClick: () => onNav('Users'),
    last: true
  })), /*#__PURE__*/React.createElement(ACard, null, /*#__PURE__*/React.createElement("h3", {
    style: {
      font: '600 18px/1 var(--font-display)',
      color: 'var(--fg-0)',
      marginBottom: 6
    }
  }, "This week"), /*#__PURE__*/React.createElement(MiniSpark, {
    series: window.ADMIN_SERIES.active.slice(-14),
    tone: "var(--teal)",
    label: "Active users"
  })))));
}
function QueueRow({
  icon,
  tone,
  label,
  count,
  onClick,
  last
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 10px',
      margin: '0 -10px',
      cursor: 'pointer',
      borderRadius: 'var(--radius-md)',
      background: hover ? 'var(--bg-2)' : 'transparent',
      borderBottom: last ? 'none' : '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 17,
    color: tone,
    weight: "fill"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      font: 'var(--text-body-sm)',
      color: 'var(--fg-1)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 15px/1 var(--font-mono)',
      color: 'var(--fg-0)'
    }
  }, count), /*#__PURE__*/React.createElement(Icon, {
    name: "caret-right",
    size: 14,
    color: "var(--fg-3)"
  }));
}

// tiny inline sparkline (area)
function MiniSpark({
  series,
  tone,
  label
}) {
  const w = 280,
    h = 70,
    max = Math.max(...series),
    min = Math.min(...series);
  const pts = series.map((v, i) => [i / (series.length - 1) * w, h - (v - min) / (max - min || 1) * (h - 8) - 4]);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = line + ` L ${w} ${h} L 0 ${h} Z`;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 16px/1 var(--font-mono)',
      color: 'var(--fg-0)'
    }
  }, fmtCount(series[series.length - 1]))), /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${w} ${h}`,
    width: "100%",
    height: h,
    preserveAspectRatio: "none"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "spark",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: tone,
    stopOpacity: "0.32"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: tone,
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement("path", {
    d: area,
    fill: "url(#spark)"
  }), /*#__PURE__*/React.createElement("path", {
    d: line,
    fill: "none",
    stroke: tone,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })));
}
Object.assign(window, {
  ADMIN_NAV,
  statusColor,
  APill,
  ABtn,
  ATabs,
  AToggle,
  AThumb,
  ASearch,
  AReasonModal,
  AToast,
  APageHead,
  ACard,
  Dashboard,
  StatCard,
  ActivityRow,
  QueueRow,
  MiniSpark
});

// ============================================================
// Sidebar + shell
// ============================================================
function AdminSidebar({
  active,
  onNav
}) {
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 240,
      flex: 'none',
      position: 'sticky',
      top: 0,
      alignSelf: 'flex-start',
      height: '100vh',
      background: 'var(--bg-1)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px 22px 18px',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    size: 19,
    onClick: () => {
      window.location.href = 'index.html';
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      marginTop: 12,
      padding: '4px 10px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--coral-ghost)',
      border: '1px solid var(--border-accent)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield-star",
    size: 12,
    color: "var(--coral-bright)",
    weight: "fill"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 10px/1 var(--font-body)',
      letterSpacing: '0.1em',
      color: 'var(--coral-bright)',
      textTransform: 'uppercase'
    }
  }, "Admin Panel"))), /*#__PURE__*/React.createElement("nav", {
    style: {
      flex: 1,
      padding: '14px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      overflowY: 'auto'
    }
  }, ADMIN_NAV.map(n => {
    const on = active === n.id;
    return /*#__PURE__*/React.createElement("button", {
      key: n.id,
      onClick: () => onNav(n.id),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 13px',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        border: 'none',
        textAlign: 'left',
        font: '600 14px/1 var(--font-body)',
        transition: 'all var(--dur-fast)',
        background: on ? 'var(--bg-3)' : 'transparent',
        color: on ? 'var(--fg-0)' : 'var(--fg-1)',
        position: 'relative'
      },
      onMouseEnter: e => {
        if (!on) e.currentTarget.style.background = 'var(--bg-2)';
      },
      onMouseLeave: e => {
        if (!on) e.currentTarget.style.background = 'transparent';
      }
    }, on && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 0,
        top: 9,
        bottom: 9,
        width: 3,
        borderRadius: '0 3px 3px 0',
        background: 'var(--coral)'
      }
    }), /*#__PURE__*/React.createElement(Icon, {
      name: n.icon,
      size: 18,
      color: on ? 'var(--coral-bright)' : 'var(--fg-2)',
      weight: on ? 'fill' : 'regular'
    }), n.id, n.id === 'Content' && window.ADMIN_STATS.pendingReviews > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto',
        font: '600 10px/1 var(--font-mono)',
        padding: '3px 6px',
        borderRadius: 'var(--radius-pill)',
        background: 'var(--warning)',
        color: '#0a0a0a'
      }
    }, window.ADMIN_STATS.pendingReviews), n.id === 'Reports' && window.ADMIN_STATS.reportedItems > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto',
        font: '600 10px/1 var(--font-mono)',
        padding: '3px 6px',
        borderRadius: 'var(--radius-pill)',
        background: 'var(--danger)',
        color: '#0a0a0a'
      }
    }, window.ADMIN_STATS.reportedItems));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 16px',
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    size: 34,
    colors: ['#d85a30', '#9d8df1']
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 13px/1.2 var(--font-body)',
      color: 'var(--fg-0)'
    }
  }, "Ada Vance"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)'
    }
  }, "Administrator"))), /*#__PURE__*/React.createElement("a", {
    onClick: () => {
      window.location.href = 'index.html';
    },
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '9px 11px',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      font: '500 13px/1 var(--font-body)',
      color: 'var(--fg-1)',
      background: 'var(--bg-2)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left",
    size: 14,
    color: "var(--fg-2)"
  }), " Back to site")));
}
function AdminApp() {
  const [nav, setNav] = React.useState('Dashboard');
  const [toastMsg, setToastMsg] = React.useState(null);
  const toast = msg => setToastMsg(msg);
  const go = n => {
    setNav(n);
    window.scrollTo(0, 0);
  };
  let page;
  if (nav === 'Dashboard') page = /*#__PURE__*/React.createElement(Dashboard, {
    onNav: go
  });else if (nav === 'Content') page = /*#__PURE__*/React.createElement(ContentPage, {
    toast: toast
  });else if (nav === 'Users') page = /*#__PURE__*/React.createElement(UsersPage, {
    toast: toast
  });else if (nav === 'Badges') page = /*#__PURE__*/React.createElement(BadgesPage, {
    toast: toast
  });else if (nav === 'Reports') page = /*#__PURE__*/React.createElement(ReportsPage, {
    toast: toast
  });else if (nav === 'Statistics') page = /*#__PURE__*/React.createElement(StatisticsPage, null);else if (nav === 'Settings') page = /*#__PURE__*/React.createElement(SettingsPage, {
    toast: toast
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--bg-0)'
    }
  }, /*#__PURE__*/React.createElement(AdminSidebar, {
    active: nav,
    onNav: go
  }), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      minWidth: 0,
      padding: '34px 38px 80px',
      maxWidth: 1280
    }
  }, page), toastMsg && /*#__PURE__*/React.createElement(AToast, {
    msg: toastMsg,
    onClose: () => setToastMsg(null)
  }));
}
Object.assign(window, {
  AdminSidebar,
  AdminApp
});

// ============================================================
// PIN entry gate — minimal dark screen shown before the panel
// ============================================================
function AdminPinGate({
  children
}) {
  const PIN = '2580';
  const LEN = 4;
  const [pin, setPin] = React.useState('');
  const [unlocked, setUnlocked] = React.useState(false);
  const [error, setError] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    ref.current && ref.current.focus();
  }, []);
  const submit = value => {
    if (value === PIN) {
      setError(false);
      setUnlocked(true);
    } else {
      setError(true);
      setPin('');
      setTimeout(() => ref.current && ref.current.focus(), 0);
    }
  };
  const onChange = raw => {
    const v = raw.replace(/[^0-9]/g, '').slice(0, LEN);
    setPin(v);
    if (error) setError(false);
    if (v.length === LEN) submit(v);
  };
  if (unlocked) return children;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: 'radial-gradient(120% 90% at 50% 0%, var(--bg-vignette), var(--bg-0) 60%)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 360,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 62,
      height: 62,
      margin: '0 auto 24px',
      borderRadius: 'var(--radius-lg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--coral-ghost)',
      border: '1px solid var(--border-accent)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock-key",
    size: 28,
    color: "var(--coral-bright)",
    weight: "fill"
  })), /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      color: 'var(--coral-bright)',
      letterSpacing: '0.14em',
      marginBottom: 12
    }
  }, "Admin Panel"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: '600 26px/1.15 var(--font-display)',
      color: 'var(--fg-0)',
      margin: '0 0 8px'
    }
  }, "Enter your PIN"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)',
      margin: '0 0 28px'
    }
  }, "This area is restricted. Enter your ", LEN, "-digit admin PIN to continue."), /*#__PURE__*/React.createElement("input", {
    ref: ref,
    value: pin,
    onChange: e => onChange(e.target.value),
    inputMode: "numeric",
    type: "password",
    autoComplete: "off",
    onKeyDown: e => {
      if (e.key === 'Enter') submit(pin);
    },
    style: {
      position: 'absolute',
      opacity: 0,
      width: 1,
      height: 1,
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    onClick: () => ref.current && ref.current.focus(),
    style: {
      display: 'flex',
      justifyContent: 'center',
      gap: 14,
      marginBottom: 22,
      cursor: 'text'
    }
  }, Array.from({
    length: LEN
  }).map((_, i) => {
    const filled = i < pin.length;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        width: 54,
        height: 62,
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-1)',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: error ? 'var(--danger)' : filled || i === pin.length ? 'var(--border-accent)' : 'var(--border-default)',
        boxShadow: i === pin.length && !error ? 'var(--glow-coral)' : 'none',
        transition: 'border-color var(--dur-fast), box-shadow var(--dur-fast)'
      }
    }, filled && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 12,
        height: 12,
        borderRadius: '50%',
        background: 'var(--fg-0)'
      }
    }));
  })), error && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      marginBottom: 18,
      padding: '8px 13px',
      borderRadius: 'var(--radius-md)',
      background: 'rgba(229,72,77,0.1)',
      border: '1px solid rgba(229,72,77,0.35)',
      font: 'var(--text-body-sm)',
      color: 'var(--score-low)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "warning",
    size: 14,
    color: "var(--score-low)"
  }), " Incorrect PIN. Try again."), /*#__PURE__*/React.createElement("button", {
    onClick: () => submit(pin),
    disabled: pin.length < LEN,
    style: {
      width: '100%',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: '13px 0',
      borderRadius: 'var(--radius-md)',
      border: 'none',
      cursor: pin.length < LEN ? 'not-allowed' : 'pointer',
      font: '600 14px/1 var(--font-body)',
      transition: 'background var(--dur-fast)',
      background: pin.length < LEN ? 'var(--bg-3)' : 'var(--coral)',
      color: pin.length < LEN ? 'var(--fg-3)' : 'var(--fg-on-accent)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 16,
    color: pin.length < LEN ? 'var(--fg-3)' : 'var(--fg-on-accent)',
    weight: "bold"
  }), " Confirm"), /*#__PURE__*/React.createElement("a", {
    onClick: () => {
      window.location.href = 'index.html';
    },
    style: {
      display: 'inline-block',
      marginTop: 22,
      cursor: 'pointer',
      font: '500 13px/1 var(--font-body)',
      color: 'var(--fg-2)'
    }
  }, "\u2190 Back to site")));
}
Object.assign(window, {
  AdminPinGate
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/Admin.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/AdminContent.jsx
try { (() => {
// Dreamwall — Admin Panel: Content management, Reports, Badge management.

// ============================================================
// Content management — Pending / Published / Rejected
// ============================================================
function ContentRow({
  item,
  onAction
}) {
  const t = window.AICDB_TYPES[item.type];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '14px 18px',
      background: 'var(--bg-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement(AThumb, {
    g: item.g,
    type: item.type,
    w: 44
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 200px',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      marginBottom: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 15px/1.2 var(--font-body)',
      color: 'var(--fg-0)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, item.title), /*#__PURE__*/React.createElement(APill, {
    label: t.label,
    tone: t.color
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)'
    }
  }, "by ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-1)'
    }
  }, item.creator), " \xB7 submitted ", item.date), item.reason && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      marginTop: 8,
      font: 'var(--text-body-sm)',
      color: '#f0686c'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x-circle",
    size: 13,
    color: "#f0686c",
    weight: "fill"
  }), " ", item.reason), item.score != null && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      marginTop: 8,
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "star",
    size: 12,
    color: scoreColor(item.score),
    weight: "fill"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: scoreColor(item.score),
      fontWeight: 700
    }
  }, item.score.toFixed(1)), " \xB7 ", item.ratings, " ratings")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap',
      justifyContent: 'flex-end'
    }
  }, item.status === 'pending' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ABtn, {
    variant: "approve",
    icon: "check",
    onClick: () => onAction('approve', item)
  }, "Approve"), /*#__PURE__*/React.createElement(ABtn, {
    variant: "reject",
    icon: "x",
    onClick: () => onAction('reject', item)
  }, "Reject"), /*#__PURE__*/React.createElement(ABtn, {
    variant: "ghost",
    icon: "pencil-simple",
    onClick: () => onAction('edit', item)
  }, "Edit")), item.status === 'published' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ABtn, {
    variant: "ghost",
    icon: "pencil-simple",
    onClick: () => onAction('edit', item)
  }, "Edit"), /*#__PURE__*/React.createElement(ABtn, {
    variant: "reject",
    icon: "trash",
    onClick: () => onAction('remove', item)
  }, "Remove")), item.status === 'rejected' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ABtn, {
    variant: "approve",
    icon: "arrow-counter-clockwise",
    onClick: () => onAction('approve', item)
  }, "Restore"), /*#__PURE__*/React.createElement(ABtn, {
    variant: "reject",
    icon: "trash",
    onClick: () => onAction('remove', item)
  }, "Remove"))));
}
function ContentPage({
  toast
}) {
  const [tab, setTab] = React.useState('pending');
  const [items, setItems] = React.useState(window.ADMIN_SUBMISSIONS);
  const [modal, setModal] = React.useState(null); // {mode, item}

  const counts = {
    pending: items.filter(i => i.status === 'pending').length,
    published: items.filter(i => i.status === 'published').length,
    rejected: items.filter(i => i.status === 'rejected').length
  };
  const shown = items.filter(i => i.status === tab);
  const setStatus = (item, status) => setItems(list => list.map(i => i.id === item.id ? {
    ...i,
    status
  } : i));
  const removeItem = item => setItems(list => list.filter(i => i.id !== item.id));
  const onAction = (mode, item) => {
    if (mode === 'approve') {
      setStatus(item, 'published');
      toast(`“${item.title}” approved & published`);
    } else if (mode === 'edit') {
      toast(`Opening editor for “${item.title}”…`);
    } else if (mode === 'reject') {
      setModal({
        mode: 'reject',
        item
      });
    } else if (mode === 'remove') {
      setModal({
        mode: 'remove',
        item
      });
    }
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(APageHead, {
    title: "Content",
    sub: "Review submissions, manage the live catalog, and handle rejected uploads."
  }, /*#__PURE__*/React.createElement(ABtn, {
    variant: "primary",
    icon: "plus",
    size: "sm"
  }, "Add content")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement(ATabs, {
    active: tab,
    onChange: setTab,
    tabs: [{
      id: 'pending',
      label: 'Pending',
      count: counts.pending,
      tone: 'var(--warning)'
    }, {
      id: 'published',
      label: 'Published',
      count: counts.published,
      tone: 'var(--success)'
    }, {
      id: 'rejected',
      label: 'Rejected',
      count: counts.rejected,
      tone: 'var(--danger)'
    }]
  })), tab === 'pending' && counts.pending > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px 16px',
      marginBottom: 16,
      background: 'rgba(229,178,59,0.08)',
      border: '1px solid rgba(229,178,59,0.3)',
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "hourglass-medium",
    size: 16,
    color: "var(--warning)",
    weight: "fill"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-1)'
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--fg-0)'
    }
  }, counts.pending, " submissions"), " are waiting for review \u2014 oldest first.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, shown.length ? shown.map(i => /*#__PURE__*/React.createElement(ContentRow, {
    key: i.id,
    item: i,
    onAction: onAction
  })) : /*#__PURE__*/React.createElement(EmptyState, {
    icon: "check-circle",
    accent: "var(--teal)",
    compact: true,
    title: `No ${tab} content`,
    sub: "You're all caught up here."
  })), modal && modal.mode === 'reject' && /*#__PURE__*/React.createElement(AReasonModal, {
    title: `Reject “${modal.item.title}”?`,
    sub: "The creator will be notified with your reason.",
    label: "Reason for rejection",
    placeholder: "e.g. Unauthorized likeness, low-effort content, duplicate\u2026",
    confirmLabel: "Reject submission",
    confirmVariant: "reject",
    requireText: true,
    onConfirm: reason => {
      setItems(list => list.map(i => i.id === modal.item.id ? {
        ...i,
        status: 'rejected',
        reason
      } : i));
      toast(`“${modal.item.title}” rejected`);
    },
    onClose: () => setModal(null)
  }), modal && modal.mode === 'remove' && /*#__PURE__*/React.createElement(AReasonModal, {
    title: `Remove “${modal.item.title}”?`,
    sub: "This permanently removes the title from Dreamwall. This can't be undone.",
    confirmLabel: "Remove permanently",
    confirmVariant: "reject",
    onConfirm: () => {
      removeItem(modal.item);
      toast(`“${modal.item.title}” removed`);
    },
    onClose: () => setModal(null)
  }));
}

// ============================================================
// Reports — Reported Content / Reported Comments
// ============================================================
function ReportRow({
  r,
  onAction
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 16,
      padding: '16px 18px',
      background: 'var(--bg-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 'var(--radius-md)',
      flex: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `${statusColor(r.severity)}1f`
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "flag",
    size: 16,
    color: statusColor(r.severity),
    weight: "fill"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      marginBottom: 5,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 15px/1.3 var(--font-body)',
      color: 'var(--fg-0)'
    }
  }, r.target), /*#__PURE__*/React.createElement(APill, {
    label: r.severity + ' priority',
    tone: statusColor(r.severity)
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-3)'
    }
  }, r.targetType)), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-1)',
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "warning-circle",
    size: 13,
    color: "var(--fg-2)"
  }), " ", r.reason), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)'
    }
  }, "Reported by ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-1)'
    }
  }, r.by), " \xB7 ", r.date)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(ABtn, {
    variant: "reject",
    icon: "trash",
    onClick: () => onAction('remove', r)
  }, "Remove content"), /*#__PURE__*/React.createElement(ABtn, {
    variant: "warn",
    icon: "warning",
    onClick: () => onAction('warn', r)
  }, "Warn user"), /*#__PURE__*/React.createElement(ABtn, {
    variant: "ghost",
    icon: "check",
    onClick: () => onAction('dismiss', r)
  }, "Dismiss")));
}
function ReportsPage({
  toast
}) {
  const [tab, setTab] = React.useState('content');
  const [data, setData] = React.useState({
    ...window.ADMIN_REPORTS,
    bugs: window.ADMIN_BUG_REPORTS
  });
  const shown = data[tab];
  const resolve = (r, verb) => {
    setData(d => ({
      ...d,
      [tab]: d[tab].filter(x => x.id !== r.id)
    }));
    toast(verb);
  };
  const onAction = (mode, r) => {
    if (mode === 'remove') resolve(r, 'Content removed & report closed');else if (mode === 'warn') resolve(r, `Warning sent to ${r.by === r.by ? r.target : ''}`.trim() || 'Warning issued');else resolve(r, 'Report dismissed');
  };
  const onBug = (mode, r) => {
    if (mode === 'fixed') resolve(r, 'Bug marked fixed & report closed');else if (mode === 'badge') resolve(r, `Bug Hunter badge awarded to ${r.by}`);else resolve(r, 'Bug report dismissed');
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(APageHead, {
    title: "Reports",
    sub: "Community flags and beta bug reports awaiting moderation. High-priority items first."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement(ATabs, {
    active: tab,
    onChange: setTab,
    tabs: [{
      id: 'content',
      label: 'Reported Content',
      count: data.content.length,
      tone: 'var(--danger)'
    }, {
      id: 'comments',
      label: 'Reported Comments',
      count: data.comments.length,
      tone: 'var(--danger)'
    }, {
      id: 'bugs',
      label: 'Bug Reports',
      count: data.bugs.length,
      tone: 'var(--teal)'
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, tab === 'bugs' ? shown.length ? shown.map(r => /*#__PURE__*/React.createElement(BugReportRow, {
    key: r.id,
    r: r,
    onAction: onBug
  })) : /*#__PURE__*/React.createElement(EmptyState, {
    icon: "bug-beetle",
    accent: "var(--teal)",
    compact: true,
    title: "No open bug reports",
    sub: "Beta testers haven't flagged anything new. Smooth sailing."
  }) : shown.length ? shown.map(r => /*#__PURE__*/React.createElement(ReportRow, {
    key: r.id,
    r: r,
    onAction: onAction
  })) : /*#__PURE__*/React.createElement(EmptyState, {
    icon: "shield-check",
    accent: "var(--teal)",
    compact: true,
    title: "Queue clear",
    sub: "No open reports in this category. Nice."
  })));
}

// a single beta bug report row
function BugReportRow({
  r,
  onAction
}) {
  const u = (window.ADMIN_USERS || []).find(x => x.handle === r.by);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 16,
      padding: '16px 18px',
      background: 'var(--bg-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 'var(--radius-md)',
      flex: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--teal-ghost)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bug-beetle",
    size: 17,
    color: "var(--teal-bright)",
    weight: "fill"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      marginBottom: 6,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7
    }
  }, u && /*#__PURE__*/React.createElement(Avatar, {
    size: 20,
    colors: u.av
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 14px/1.2 var(--font-body)',
      color: 'var(--fg-0)'
    }
  }, r.by)), /*#__PURE__*/React.createElement(APill, {
    label: r.page,
    tone: "var(--info)",
    icon: "map-pin"
  }), r.image && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "paperclip",
    size: 13,
    color: "var(--fg-2)"
  }), " 1 image")), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-1)',
      marginBottom: 6,
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    }
  }, r.desc), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-3)'
    }
  }, "Reported ", r.date)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(ABtn, {
    variant: "approve",
    icon: "check",
    onClick: () => onAction('fixed', r)
  }, "Mark fixed"), /*#__PURE__*/React.createElement(ABtn, {
    variant: "warn",
    icon: "medal",
    onClick: () => onAction('badge', r)
  }, "Award badge"), /*#__PURE__*/React.createElement(ABtn, {
    variant: "ghost",
    icon: "x",
    onClick: () => onAction('dismiss', r)
  }, "Dismiss")));
}

// ============================================================
// Badge management — Staff Pick (manual) + Hidden Gem (auto)
// ============================================================
function BadgeRow({
  film,
  onToggleStaff
}) {
  const auto = window.AICDB_RIBBON(film) === 'gem';
  const isStaff = !!film._staff;
  const views = Math.round(window.AICDB_STAT(film).watched);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '12px 18px',
      background: 'var(--bg-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement(AThumb, {
    g: film.g,
    type: film.type,
    w: 40
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 180px',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 15px/1.2 var(--font-body)',
      color: 'var(--fg-0)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, film.title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)',
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: scoreColor(film.score),
      fontWeight: 700
    }
  }, film.score.toFixed(1)), " \xB7 ", fmtCount(views), " views \xB7 ", film.creator)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flex: 'none',
      minWidth: 200,
      justifyContent: 'flex-end'
    }
  }, isStaff && /*#__PURE__*/React.createElement(APill, {
    label: "Staff Pick",
    tone: "var(--coral)",
    solid: true,
    icon: "medal"
  }), auto && /*#__PURE__*/React.createElement(APill, {
    label: "Hidden Gem \xB7 auto",
    tone: "var(--teal)",
    solid: true,
    icon: "diamond"
  }), !isStaff && !auto && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-3)'
    }
  }, "No badges")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      flex: 'none',
      paddingLeft: 18,
      borderLeft: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-body-sm)',
      color: isStaff ? 'var(--coral-bright)' : 'var(--fg-2)'
    }
  }, "Staff Pick"), /*#__PURE__*/React.createElement(AToggle, {
    on: isStaff,
    onChange: () => onToggleStaff(film)
  }))));
}
function BadgesPage({
  toast
}) {
  const [films, setFilms] = React.useState(() => window.AICDB_FILMS.map(f => ({
    ...f,
    _staff: !!f.staffPick
  })));
  const [filter, setFilter] = React.useState('all');
  const toggleStaff = film => {
    setFilms(list => list.map(f => f.id === film.id ? {
      ...f,
      _staff: !f._staff
    } : f));
    toast(film._staff ? `Staff Pick removed from “${film.title}”` : `“${film.title}” marked as Staff Pick`);
  };
  const shown = films.filter(f => filter === 'all' ? true : filter === 'staff' ? f._staff : filter === 'gem' ? window.AICDB_RIBBON(f) === 'gem' : !f._staff && window.AICDB_RIBBON(f) !== 'gem');
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(APageHead, {
    title: "Badges",
    sub: "Staff Pick is assigned manually. Hidden Gem is auto-awarded to high-rated, low-view titles \u2014 override below."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 20,
      flexWrap: 'wrap'
    }
  }, [['all', 'All content'], ['staff', 'Staff Picks'], ['gem', 'Hidden Gems'], ['none', 'No badges']].map(([id, label]) => /*#__PURE__*/React.createElement(ABtn, {
    key: id,
    variant: filter === id ? 'neutral' : 'ghost',
    onClick: () => setFilter(id)
  }, label))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      padding: '12px 18px',
      marginBottom: 16,
      background: 'var(--bg-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(APill, {
    label: "Staff Pick",
    tone: "var(--coral)",
    solid: true,
    icon: "medal"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)'
    }
  }, "editorially selected")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(APill, {
    label: "Hidden Gem",
    tone: "var(--teal)",
    solid: true,
    icon: "diamond"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)'
    }
  }, "auto: score \u2265 8.0 & under 9k ratings"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, shown.map(f => /*#__PURE__*/React.createElement(BadgeRow, {
    key: f.id,
    film: f,
    onToggleStaff: toggleStaff
  }))));
}
Object.assign(window, {
  ContentPage,
  ContentRow,
  ReportsPage,
  ReportRow,
  BugReportRow,
  BadgesPage,
  BadgeRow
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/AdminContent.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/AdminUsersStats.jsx
try { (() => {
// Dreamwall — Admin Panel: Users, Statistics (charts), Settings.

// ============================================================
// User management
// ============================================================
function fmtJoin(d) {
  const [y, m] = d.split('-');
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1] + ' ' + y;
}
function UserRow({
  u,
  onAction
}) {
  const role = u.banned ? 'banned' : u.role;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2.4fr 1.5fr 0.9fr 0.7fr 0.9fr auto',
      alignItems: 'center',
      gap: 14,
      padding: '12px 18px',
      background: 'var(--bg-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      opacity: u.banned ? 0.5 : 1,
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    size: 38,
    colors: u.av
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 14px/1.2 var(--font-body)',
      color: 'var(--fg-0)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, u.name), u.verified && /*#__PURE__*/React.createElement(Icon, {
    name: "seal-check",
    size: 13,
    color: "var(--teal-bright)",
    weight: "fill"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)'
    }
  }, u.handle))), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, u.email), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)'
    }
  }, fmtJoin(u.joined)), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 14px/1 var(--font-mono)',
      color: u.works ? 'var(--fg-0)' : 'var(--fg-3)'
    }
  }, u.works), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(APill, {
    label: role,
    tone: statusColor(role)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      justifyContent: 'flex-end'
    }
  }, !u.banned && /*#__PURE__*/React.createElement(ABtn, {
    variant: "warn",
    icon: "warning",
    size: "xs",
    onClick: () => onAction('warn', u)
  }, "Warn"), u.banned ? /*#__PURE__*/React.createElement(ABtn, {
    variant: "approve",
    icon: "lock-open",
    size: "xs",
    onClick: () => onAction('unban', u)
  }, "Unban") : /*#__PURE__*/React.createElement(ABtn, {
    variant: "reject",
    icon: "prohibit",
    size: "xs",
    onClick: () => onAction('ban', u)
  }, "Ban"), /*#__PURE__*/React.createElement(AUserMenu, {
    u: u,
    onAction: onAction
  })));
}
function AUserMenu({
  u,
  onAction
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const close = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  const item = (icon, label, act) => /*#__PURE__*/React.createElement("div", {
    onClick: () => {
      setOpen(false);
      onAction(act, u);
    },
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '9px 11px',
      cursor: 'pointer',
      borderRadius: 'var(--radius-md)',
      font: '500 13px/1 var(--font-body)',
      color: 'var(--fg-1)'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--bg-2)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 15,
    color: "var(--fg-2)"
  }), label);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(o => !o),
    style: {
      width: 32,
      height: 32,
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      background: 'transparent',
      border: '1px solid var(--border-default)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "dots-three-vertical",
    size: 16,
    color: "var(--fg-1)",
    weight: "bold"
  })), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 'calc(100% + 6px)',
      right: 0,
      zIndex: 60,
      width: 190,
      padding: 6,
      background: 'var(--bg-1)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-3)'
    }
  }, item('user', 'View profile', 'view'), item(u.role === 'creator' ? 'user-minus' : 'user-plus', u.role === 'creator' ? 'Revoke creator' : 'Make creator', 'toggleCreator')));
}
function UsersPage({
  toast
}) {
  const [users, setUsers] = React.useState(window.ADMIN_USERS);
  const [q, setQ] = React.useState('');
  const [filter, setFilter] = React.useState('all');
  const onAction = (mode, u) => {
    if (mode === 'ban') setUsers(list => list.map(x => x.id === u.id ? {
      ...x,
      banned: true
    } : x)), toast(`${u.name} has been banned`);else if (mode === 'unban') setUsers(list => list.map(x => x.id === u.id ? {
      ...x,
      banned: false
    } : x)), toast(`${u.name} reinstated`);else if (mode === 'warn') toast(`Warning sent to ${u.name}`);else if (mode === 'view') toast(`Opening ${u.handle}'s profile…`);else if (mode === 'toggleCreator') {
      setUsers(list => list.map(x => x.id === u.id ? {
        ...x,
        role: x.role === 'creator' ? 'viewer' : 'creator'
      } : x));
      toast(u.role === 'creator' ? `${u.name} is no longer a creator` : `${u.name} is now a creator`);
    }
  };
  const ql = q.trim().toLowerCase();
  const shown = users.filter(u => {
    if (filter === 'creators' && u.role !== 'creator') return false;
    if (filter === 'banned' && !u.banned) return false;
    if (ql && !(u.name.toLowerCase().includes(ql) || u.handle.toLowerCase().includes(ql) || u.email.toLowerCase().includes(ql))) return false;
    return true;
  });
  const filters = [['all', 'All', users.length], ['creators', 'Creators', users.filter(u => u.role === 'creator').length], ['banned', 'Banned', users.filter(u => u.banned).length]];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(APageHead, {
    title: "Users",
    sub: `${fmtCount(window.ADMIN_STATS.totalUsers)} total accounts · ${users.filter(u => u.banned).length} banned`
  }, /*#__PURE__*/React.createElement(ASearch, {
    value: q,
    onChange: setQ,
    placeholder: "Search name, handle, email\u2026"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 18,
      flexWrap: 'wrap'
    }
  }, filters.map(([id, label, n]) => /*#__PURE__*/React.createElement(ABtn, {
    key: id,
    variant: filter === id ? 'neutral' : 'ghost',
    onClick: () => setFilter(id)
  }, label, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 11px/1 var(--font-mono)',
      color: 'var(--fg-3)'
    }
  }, n)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2.4fr 1.5fr 0.9fr 0.7fr 0.9fr auto',
      gap: 14,
      padding: '0 18px 10px'
    }
  }, ['User', 'Email', 'Joined', 'Works', 'Role', ''].map((h, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "overline",
    style: {
      color: 'var(--fg-3)',
      textAlign: i === 5 ? 'right' : 'left'
    }
  }, h))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, shown.length ? shown.map(u => /*#__PURE__*/React.createElement(UserRow, {
    key: u.id,
    u: u,
    onAction: onAction
  })) : /*#__PURE__*/React.createElement(EmptyState, {
    icon: "user",
    accent: "var(--teal)",
    compact: true,
    title: "No users found",
    sub: "Try a different search or filter."
  })));
}

// ============================================================
// Statistics — charts + leaderboards
// ============================================================
function ChartCard({
  title,
  value,
  delta,
  children
}) {
  return /*#__PURE__*/React.createElement(ACard, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      color: 'var(--fg-2)',
      marginBottom: 8
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 26px/1 var(--font-mono)',
      color: 'var(--fg-0)'
    }
  }, value), delta && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 12px/1 var(--font-mono)',
      color: 'var(--teal-bright)'
    }
  }, delta)))), children);
}

// area/line chart with axis + hover-free grid
function LineChart({
  series,
  tone,
  height = 150
}) {
  const w = 520,
    h = height,
    pad = 8;
  const max = Math.max(...series),
    min = Math.min(...series);
  const x = i => i / (series.length - 1) * (w - pad * 2) + pad;
  const y = v => h - pad - (v - min) / (max - min || 1) * (h - pad * 2);
  const pts = series.map((v, i) => [x(i), y(v)]);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = line + ` L ${x(series.length - 1)} ${h} L ${x(0)} ${h} Z`;
  const gid = 'lc' + tone.replace(/[^a-z]/gi, '');
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${w} ${h}`,
    width: "100%",
    height: h,
    preserveAspectRatio: "none"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: gid,
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: tone,
    stopOpacity: "0.3"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: tone,
    stopOpacity: "0"
  }))), [0.25, 0.5, 0.75].map(g => /*#__PURE__*/React.createElement("line", {
    key: g,
    x1: pad,
    x2: w - pad,
    y1: h * g,
    y2: h * g,
    stroke: "var(--border-subtle)",
    strokeWidth: "1"
  })), /*#__PURE__*/React.createElement("path", {
    d: area,
    fill: `url(#${gid})`
  }), /*#__PURE__*/React.createElement("path", {
    d: line,
    fill: "none",
    stroke: tone,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), pts.filter((_, i) => i === pts.length - 1).map((p, i) => /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: p[0],
    cy: p[1],
    r: "4",
    fill: tone,
    stroke: "var(--bg-1)",
    strokeWidth: "2"
  })));
}
function BarChart({
  series,
  tone,
  height = 150
}) {
  const max = Math.max(...series);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 3,
      height,
      padding: '0 2px'
    }
  }, series.map((v, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    title: fmtCount(v),
    style: {
      flex: 1,
      height: `${v / max * 100}%`,
      minHeight: 3,
      borderRadius: '3px 3px 0 0',
      background: tone,
      opacity: i === series.length - 1 ? 1 : 0.4,
      transition: 'height var(--dur-base)'
    }
  })));
}
function RangeToggle({
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      gap: 2,
      padding: 3,
      background: 'var(--bg-0)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-subtle)'
    }
  }, ['Daily', 'Weekly', 'Monthly'].map(r => {
    const on = value === r;
    return /*#__PURE__*/React.createElement("button", {
      key: r,
      onClick: () => onChange(r),
      style: {
        padding: '6px 12px',
        borderRadius: 'var(--radius-sm)',
        border: 'none',
        cursor: 'pointer',
        font: '600 12px/1 var(--font-body)',
        background: on ? 'var(--bg-3)' : 'transparent',
        color: on ? 'var(--fg-0)' : 'var(--fg-2)'
      }
    }, r);
  }));
}
function LeaderList({
  title,
  rows
}) {
  return /*#__PURE__*/React.createElement(ACard, null, /*#__PURE__*/React.createElement("h3", {
    style: {
      font: '600 18px/1 var(--font-display)',
      color: 'var(--fg-0)',
      marginBottom: 16
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, rows.map((row, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 13,
      padding: '10px 0',
      borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 14px/1 var(--font-mono)',
      color: 'var(--fg-3)',
      width: 18,
      flex: 'none'
    }
  }, i + 1), row.thumb, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 14px/1.2 var(--font-body)',
      color: 'var(--fg-0)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, row.label), row.sub && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)',
      marginTop: 3
    }
  }, row.sub)), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 14px/1 var(--font-mono)',
      color: row.metricColor || 'var(--fg-1)',
      flex: 'none'
    }
  }, row.metric)))));
}
function StatisticsPage() {
  const [range, setRange] = React.useState('Daily');
  const s = window.ADMIN_SERIES;
  const L = window.ADMIN_LEADERS;
  // derive weekly/monthly aggregates from the daily series
  const agg = (arr, size) => {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(Math.round(arr.slice(i, i + size).reduce((a, b) => a + b, 0) / Math.min(size, arr.length - i)));
    return out;
  };
  const active = range === 'Daily' ? s.active : range === 'Weekly' ? agg(s.active, 7) : agg(s.active, 15);
  const avgActive = Math.round(active.reduce((a, b) => a + b, 0) / active.length);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(APageHead, {
    title: "Statistics",
    sub: "Growth, engagement, and the titles & creators driving the platform."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 20,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(ChartCard, {
    title: "Active users",
    value: fmtCount(active[active.length - 1]),
    delta: "+1.8%"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(RangeToggle, {
    value: range,
    onChange: setRange
  })), /*#__PURE__*/React.createElement(LineChart, {
    series: active,
    tone: "var(--teal)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-3)',
      marginTop: 10
    }
  }, "Avg ", fmtCount(avgActive), " \xB7 ", range.toLowerCase(), " active")), /*#__PURE__*/React.createElement(ChartCard, {
    title: "New registrations",
    value: fmtCount(s.regs.reduce((a, b) => a + b, 0)),
    delta: "+6.4%"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 34
    }
  }), /*#__PURE__*/React.createElement(BarChart, {
    series: s.regs,
    tone: "var(--coral)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-3)',
      marginTop: 10
    }
  }, "Last 30 days \xB7 ", fmtCount(s.regs[s.regs.length - 1]), " today"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(LeaderList, {
    title: "Most viewed",
    rows: L.byViews.map(x => ({
      thumb: /*#__PURE__*/React.createElement(AThumb, {
        g: x.film.g,
        type: x.film.type,
        w: 32
      }),
      label: x.film.title,
      sub: x.film.creator,
      metric: fmtCount(x.views),
      metricColor: 'var(--teal-bright)'
    }))
  }), /*#__PURE__*/React.createElement(LeaderList, {
    title: "Most rated",
    rows: L.byRatings.map(x => ({
      thumb: /*#__PURE__*/React.createElement(AThumb, {
        g: x.film.g,
        type: x.film.type,
        w: 32
      }),
      label: x.film.title,
      sub: `${x.film.score.toFixed(1)} avg`,
      metric: fmtCount(x.rated),
      metricColor: 'var(--coral-bright)'
    }))
  }), /*#__PURE__*/React.createElement(LeaderList, {
    title: "Top creators",
    rows: L.topCreators.map(c => ({
      thumb: /*#__PURE__*/React.createElement("div", {
        style: {
          width: 32,
          height: 32,
          borderRadius: '50%',
          flex: 'none',
          background: `linear-gradient(135deg, ${c.av[0]}, ${c.av[1]})`
        }
      }),
      label: c.name,
      sub: c.handle,
      metric: fmtCount(c.followers),
      metricColor: 'var(--fg-0)'
    }))
  })));
}

// ============================================================
// Settings — announcement, content guidelines, language
// ============================================================
function SettingsPage({
  toast
}) {
  const [annOn, setAnnOn] = React.useState(true);
  const [annMsg, setAnnMsg] = React.useState('Dreamwall is now open to new creators — switch to a creator account to publish your work.');
  const [guidelines, setGuidelines] = React.useState('Dreamwall celebrates AI-generated film & series.\n\n1. Credit your tools and collaborators.\n2. No unauthorized likenesses of real people.\n3. Label disturbing content with a warning.\n4. Every score comes from real viewers — no vote manipulation.\n5. No spam, harassment, or self-promotion in comments.');
  const [lang, setLang] = React.useState('EN');
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(APageHead, {
    title: "Settings",
    sub: "Platform-wide configuration."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      maxWidth: 760
    }
  }, /*#__PURE__*/React.createElement(ACard, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 16,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      font: '600 18px/1.2 var(--font-display)',
      color: 'var(--fg-0)',
      margin: '0 0 5px'
    }
  }, "Site announcement banner"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)',
      margin: 0
    }
  }, "When on, every user sees this banner on the homepage.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 12px/1 var(--font-body)',
      color: annOn ? 'var(--teal-bright)' : 'var(--fg-3)'
    }
  }, annOn ? 'On' : 'Off'), /*#__PURE__*/React.createElement(AToggle, {
    on: annOn,
    onChange: setAnnOn
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      opacity: annOn ? 1 : 0.4,
      transition: 'opacity var(--dur-base)',
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      padding: '12px 16px',
      borderRadius: 'var(--radius-md)',
      marginBottom: 14,
      background: 'linear-gradient(90deg, var(--coral-ghost), transparent)',
      border: '1px solid var(--border-accent)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "megaphone",
    size: 17,
    color: "var(--coral-bright)",
    weight: "fill"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-0)',
      flex: 1
    }
  }, annMsg || 'Your announcement preview appears here.'), /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 14,
    color: "var(--fg-3)"
  })), /*#__PURE__*/React.createElement("textarea", {
    value: annMsg,
    onChange: e => setAnnMsg(e.target.value),
    rows: 2,
    style: {
      width: '100%',
      resize: 'vertical',
      background: 'var(--bg-0)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      padding: '11px 13px',
      color: 'var(--fg-0)',
      font: 'var(--text-body)',
      outline: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(ABtn, {
    variant: "primary",
    icon: "check",
    onClick: () => toast('Announcement saved')
  }, "Save banner"))), /*#__PURE__*/React.createElement(ACard, null, /*#__PURE__*/React.createElement("h3", {
    style: {
      font: '600 18px/1.2 var(--font-display)',
      color: 'var(--fg-0)',
      margin: '0 0 5px'
    }
  }, "Content guidelines"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)',
      margin: '0 0 14px'
    }
  }, "Shown to creators on submission and linked in the footer."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 2,
      padding: 6,
      background: 'var(--bg-0)',
      borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
      border: '1px solid var(--border-default)',
      borderBottom: 'none'
    }
  }, ['text-b', 'text-italic', 'list-bullets', 'list-numbers', 'link'].map(ic => /*#__PURE__*/React.createElement("button", {
    key: ic,
    style: {
      width: 30,
      height: 30,
      borderRadius: 'var(--radius-sm)',
      border: 'none',
      cursor: 'pointer',
      background: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--bg-3)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 15,
    color: "var(--fg-1)"
  })))), /*#__PURE__*/React.createElement("textarea", {
    value: guidelines,
    onChange: e => setGuidelines(e.target.value),
    rows: 8,
    style: {
      width: '100%',
      resize: 'vertical',
      background: 'var(--bg-0)',
      border: '1px solid var(--border-default)',
      borderRadius: '0 0 var(--radius-md) var(--radius-md)',
      padding: '13px',
      color: 'var(--fg-0)',
      font: 'var(--text-body)',
      lineHeight: 1.6,
      outline: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(ABtn, {
    variant: "primary",
    icon: "check",
    onClick: () => toast('Guidelines updated')
  }, "Save guidelines"))), /*#__PURE__*/React.createElement(ACard, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      font: '600 18px/1.2 var(--font-display)',
      color: 'var(--fg-0)',
      margin: '0 0 5px'
    }
  }, "Default language"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)',
      margin: 0
    }
  }, "Localization is groundwork \u2014 only English is active today.")), /*#__PURE__*/React.createElement("select", {
    value: lang,
    onChange: e => setLang(e.target.value),
    style: {
      background: 'var(--bg-0)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      padding: '10px 14px',
      color: 'var(--fg-0)',
      font: 'var(--text-body-sm)',
      cursor: 'pointer',
      outline: 'none'
    }
  }, (window.AICDB_LANGS || ['EN']).map(l => /*#__PURE__*/React.createElement("option", {
    key: l,
    value: l
  }, l === 'EN' ? 'English (EN)' : l)))))));
}
Object.assign(window, {
  UsersPage,
  UserRow,
  AUserMenu,
  StatisticsPage,
  LineChart,
  BarChart,
  ChartCard,
  RangeToggle,
  LeaderList,
  SettingsPage,
  fmtJoin
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/AdminUsersStats.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/App.jsx
try { (() => {
// Dreamwall UI kit — app shell + simple client routing
function BrowseGrid({
  title,
  films,
  onOpen,
  sub
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: '0 auto',
      padding: '32px 28px 80px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--text-h1)',
      color: 'var(--fg-0)',
      letterSpacing: '-0.015em',
      marginBottom: 8
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body)',
      color: 'var(--fg-2)'
    }
  }, sub || `${films.length} ${films.length === 1 ? 'title' : 'titles'}`)), films.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: 22
    }
  }, films.map(f => /*#__PURE__*/React.createElement(FilmCard, {
    key: f.id,
    film: f,
    onOpen: onOpen,
    width: "auto"
  }))) : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '60px 0',
      textAlign: 'center',
      font: 'var(--text-body)',
      color: 'var(--fg-2)'
    }
  }, title.toLowerCase().includes('watchlist') ? 'Your watchlist is empty — hover any poster and tap + to add titles.' : 'No titles match — try another search.'));
}

// ---- a single watchlist row: rating (left) + poster + meta, with persistent action buttons on the right ----
function WatchlistRow({
  film,
  onOpen,
  onWatch,
  onRate
}) {
  const [hover, setHover] = React.useState(false);
  const t = window.AICDB_TYPES[film.type];
  const aspect = film.type === 'vertical' ? '9/16' : '2/3';
  const actions = [{
    icon: 'star',
    label: 'Rate',
    color: 'var(--coral-bright)',
    onClick: () => onRate && onRate(film)
  }, {
    icon: 'play',
    label: 'Watch',
    color: 'var(--teal-bright)',
    onClick: () => onWatch && onWatch(film)
  }, {
    icon: 'trash',
    label: 'Remove',
    color: 'var(--score-low)',
    onClick: () => window.AICDB_WATCHLIST.toggle(film.id)
  }];
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '14px 16px',
      background: 'var(--bg-1)',
      border: '1px solid ' + (hover ? 'var(--border-default)' : 'var(--border-subtle)'),
      borderRadius: 'var(--radius-lg)',
      transition: 'border-color var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 'none',
      width: 58,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 24px/1 var(--font-mono)',
      color: scoreColor(film.score)
    }
  }, film.score.toFixed(1))), /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      color: 'var(--fg-3)',
      marginTop: 6
    }
  }, "Score")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 'none',
      alignSelf: 'stretch',
      width: 1,
      background: 'var(--border-subtle)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    onClick: () => onOpen(film),
    style: {
      width: 54,
      flex: 'none',
      aspectRatio: aspect,
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      cursor: 'pointer',
      background: `linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 150%)`,
      boxShadow: 'var(--shadow-1)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    onClick: () => onOpen(film),
    style: {
      flex: 1,
      minWidth: 0,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 17px/1.2 var(--font-display)',
      color: 'var(--fg-0)'
    }
  }, film.title), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 9px/1 var(--font-body)',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      color: t.text,
      background: t.ghost,
      padding: '4px 8px',
      borderRadius: 'var(--radius-pill)'
    }
  }, t.label)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      marginTop: 6,
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)'
    }
  }, /*#__PURE__*/React.createElement("span", null, film.year), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-3)'
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, film.runtime), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-3)'
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, film.creator))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: 7
    }
  }, actions.map(a => /*#__PURE__*/React.createElement("button", {
    key: a.label,
    onClick: e => {
      e.stopPropagation();
      a.onClick();
    },
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      padding: '9px 13px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-subtle)',
      cursor: 'pointer',
      background: 'var(--bg-2)',
      color: 'var(--fg-1)',
      font: '600 12.5px/1 var(--font-body)',
      whiteSpace: 'nowrap',
      transition: 'all var(--dur-fast)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = a.color;
      e.currentTarget.style.color = a.color;
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = 'var(--border-subtle)';
      e.currentTarget.style.color = 'var(--fg-1)';
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: a.icon,
    size: 14,
    color: "currentColor",
    fill: a.icon === 'play' ? 'currentColor' : 'none'
  }), a.label))));
}
function WatchlistView({
  films,
  onOpen,
  onNav,
  onWatch
}) {
  const [rateFilm, setRateFilm] = React.useState(null);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 860,
      margin: '0 auto',
      padding: '32px 28px 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--text-h1)',
      color: 'var(--fg-0)',
      letterSpacing: '-0.015em',
      marginBottom: 8
    }
  }, "Your Watchlist"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body)',
      color: 'var(--fg-2)'
    }
  }, films.length, " ", films.length === 1 ? 'title' : 'titles', " saved to watch")), films.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, films.map(f => /*#__PURE__*/React.createElement(WatchlistRow, {
    key: f.id,
    film: f,
    onOpen: onOpen,
    onWatch: onWatch,
    onRate: setRateFilm
  }))) : /*#__PURE__*/React.createElement(EmptyState, {
    icon: "bookmark-simple",
    accent: "var(--teal)",
    title: "Nothing here yet",
    sub: "Start exploring and tap the bookmark on any poster to save it for later.",
    actionLabel: "Browse the catalog",
    onAction: () => onNav && onNav('Films')
  }), rateFilm && /*#__PURE__*/React.createElement(RatingPanel, {
    film: rateFilm,
    onClose: () => setRateFilm(null),
    onSubmit: () => setRateFilm(null)
  }));
}

// the signed-in user's own reviews (text only — score shown separately if they rated it)
const MY_REVIEWS = [{
  id: 'echoes-of-tomorrow',
  when: '2 days ago',
  score: 5.0,
  body: "Still the bar. The third act rewires how you think about memory on a second watch — I keep finding new seams in the edit."
}, {
  id: 'saltwater-gods',
  when: '1 week ago',
  score: 4.5,
  body: "The drowned-pantheon sequence is the most beautiful thing I've seen come out of a diffusion pipeline. Loses a little momentum mid-film, but the ending earns it."
}, {
  id: 'glass-orchard',
  when: '3 weeks ago',
  score: 4.0,
  body: "Quiet, patient, and gorgeously lit. Not for everyone, but if you let it breathe it gets under your skin."
}, {
  id: 'redshift',
  when: '1 month ago',
  body: "Technically dazzling. I wanted a little more heart underneath the spectacle — still very much worth your time."
}];
function MyReviewRow({
  r,
  onOpen
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      padding: '18px',
      background: 'var(--bg-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => onOpen(r.film),
    style: {
      width: 54,
      flex: 'none',
      aspectRatio: '2/3',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      cursor: 'pointer',
      background: `linear-gradient(150deg, ${r.film.g[0]}, ${r.film.g[1]} 150%)`,
      boxShadow: 'var(--shadow-1)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 7,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => onOpen(r.film),
    style: {
      font: '600 16px/1.2 var(--font-display)',
      color: 'var(--fg-0)',
      cursor: 'pointer'
    }
  }, r.film.title), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)'
    }
  }, r.film.year), r.score != null && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '3px 9px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--coral-ghost)',
      border: '1px solid var(--border-accent)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "star",
    size: 11,
    color: "var(--coral-bright)",
    weight: "fill"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 11px/1 var(--font-mono)',
      color: 'var(--coral-bright)'
    }
  }, r.score.toFixed(1)), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 9px/1 var(--font-mono)',
      color: 'var(--fg-3)',
      letterSpacing: '0.04em'
    }
  }, "YOUR SCORE")), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-3)'
    }
  }, "\xB7 ", r.when)), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body)',
      color: 'var(--fg-1)',
      margin: '0 0 12px'
    }
  }, r.body), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    icon: "pencil-simple"
  }, "Edit"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    icon: "trash"
  }, "Delete"))));
}
function MyReviewsView({
  onOpen,
  onNav
}) {
  const byId = window.AICDB_FILM_BY_ID;
  const rows = MY_REVIEWS.map(r => ({
    ...r,
    film: byId[r.id]
  })).filter(r => r.film);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 820,
      margin: '0 auto',
      padding: '32px 28px 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 26
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--text-h1)',
      color: 'var(--fg-0)',
      letterSpacing: '-0.015em',
      marginBottom: 8
    }
  }, "My Reviews"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body)',
      color: 'var(--fg-2)'
    }
  }, rows.length, " ", rows.length === 1 ? 'review' : 'reviews', " written \xB7 ratings are tracked separately")), rows.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, rows.map(r => /*#__PURE__*/React.createElement(MyReviewRow, {
    key: r.id,
    r: r,
    onOpen: onOpen
  }))) : /*#__PURE__*/React.createElement(EmptyState, {
    icon: "chat-text",
    accent: "var(--coral)",
    title: "You haven\u2019t written any reviews",
    sub: "Share your take on a title and it\u2019ll show up here.",
    actionLabel: "Browse the catalog",
    onAction: () => onNav && onNav('Films')
  }));
}
function App() {
  const [nav, setNav] = React.useState(() => {
    const h = decodeURIComponent((window.location.hash || '').replace(/^#/, '')).trim();
    const allowed = ['Discover', 'Feed', 'Films', 'Series', 'Creators', 'What is Dreamwall', 'Profile', 'Watchlist', 'My Reviews', 'Preferences'];
    // Landing always opens on Discover; deep links to other in-app views still resolve.
    return allowed.includes(h) ? h : 'Discover';
  });
  const [detail, setDetail] = React.useState(null);
  const [watching, setWatching] = React.useState(null);
  const [query, setQuery] = React.useState('');
  const films = window.AICDB_FILMS;
  const watchlist = useWatchlist();
  const open = f => {
    if (!f) {
      goNav('Films');
      return;
    }
    setDetail(f);
    setWatching(null);
    window.scrollTo(0, 0);
  };
  const goNav = n => {
    setNav(n);
    setDetail(null);
    setWatching(null);
    setQuery('');
    window.scrollTo(0, 0);
    try {
      history.replaceState(null, '', '#' + encodeURIComponent(n));
    } catch (e) {}
  };
  const openResult = f => {
    setQuery('');
    open(f);
  };
  const goCreator = creator => {
    window.location.href = 'creator.html?name=' + encodeURIComponent(creator);
  };
  let view,
    showFooter = true;
  if (watching) {
    return /*#__PURE__*/React.createElement(Watching, {
      film: watching,
      onBack: () => {
        setWatching(null);
        window.scrollTo(0, 0);
      }
    });
  } else if (detail) {
    view = /*#__PURE__*/React.createElement(FilmDetail, {
      film: detail,
      onBack: () => setDetail(null),
      onWatch: f => {
        setWatching(f);
        window.scrollTo(0, 0);
      },
      onCreator: goCreator,
      onOpen: open
    });
  } else if (nav === 'Profile') {
    view = /*#__PURE__*/React.createElement(Profile, {
      embedded: true,
      onOpen: open
    });
  } else if (nav === 'Watchlist') {
    const wl = watchlist.map(id => films.find(f => f.id === id)).filter(Boolean);
    view = /*#__PURE__*/React.createElement(WatchlistView, {
      films: wl,
      onOpen: open,
      onNav: goNav,
      onWatch: f => {
        setWatching(f);
        window.scrollTo(0, 0);
      }
    });
  } else if (nav === 'My Reviews') {
    view = /*#__PURE__*/React.createElement(MyReviewsView, {
      onOpen: open,
      onNav: goNav
    });
  } else if (nav === 'Preferences') {
    view = /*#__PURE__*/React.createElement(Preferences, null);
  } else if (nav === 'Discover') {
    view = /*#__PURE__*/React.createElement(Discover, {
      onOpen: open
    });
  } else if (nav === 'Films') {
    view = /*#__PURE__*/React.createElement(FilmsPage, {
      onOpen: open
    });
  } else if (nav === 'Series') {
    view = /*#__PURE__*/React.createElement(SeriesPage, {
      onOpen: open
    });
  } else if (nav === 'Creators') {
    view = /*#__PURE__*/React.createElement(CreatorsPage, {
      onCreator: goCreator,
      onOpen: open
    });
  } else if (nav === 'What is Dreamwall') {
    view = /*#__PURE__*/React.createElement(WhatIs, {
      onNav: goNav
    });
  } else {
    view = /*#__PURE__*/React.createElement(Feed, {
      onOpen: open,
      onCreator: goCreator,
      onNav: goNav
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(NavBar, {
    active: detail ? '' : nav,
    onNav: goNav,
    query: query,
    onQuery: setQuery,
    onOpenResult: openResult
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, view), showFooter && /*#__PURE__*/React.createElement(Footer, {
    onNav: goNav
  }));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/BrandIcons.jsx
try { (() => {
// Dreamwall UI kit — social brand glyphs (inline SVG, brand-accurate marks)
function GoogleIcon({
  size = 18
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 48 48",
    style: {
      display: 'block',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("path", {
    fill: "#FFC107",
    d: "M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#FF3D00",
    d: "M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#4CAF50",
    d: "M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#1976D2",
    d: "M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
  }));
}
function FacebookIcon({
  size = 18
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    style: {
      display: 'block',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("path", {
    fill: "#1877F2",
    d: "M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.491 0-1.956.925-1.956 1.874V12h3.328l-.532 3.469h-2.796v8.385C19.612 22.954 24 17.99 24 12z"
  }));
}
function InstagramIcon({
  size = 18
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    style: {
      display: 'block',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("radialGradient", {
    id: "ig-g",
    cx: "0.3",
    cy: "1",
    r: "1.1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#FFD776"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "25%",
    stopColor: "#F3A03E"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "50%",
    stopColor: "#E8453C"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "75%",
    stopColor: "#C32AA3"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#7D2AE7"
  }))), /*#__PURE__*/React.createElement("rect", {
    x: "1.5",
    y: "1.5",
    width: "21",
    height: "21",
    rx: "6",
    fill: "url(#ig-g)"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "5.4",
    y: "5.4",
    width: "13.2",
    height: "13.2",
    rx: "4",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "1.7"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3.2",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "1.7"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "16.6",
    cy: "7.4",
    r: "1.1",
    fill: "#fff"
  }));
}
function XIcon({
  size = 16
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    style: {
      display: 'block',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("path", {
    fill: "#fff",
    d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817-5.966 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"
  }));
}
function TikTokIcon({
  size = 18
}) {
  const d = "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z";
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    style: {
      display: 'block',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("path", {
    fill: "#25F4EE",
    d: d,
    transform: "translate(-0.9 0.6)"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#FE2C55",
    d: d,
    transform: "translate(0.9 -0.4)"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#fff",
    d: d
  }));
}
Object.assign(window, {
  GoogleIcon,
  FacebookIcon,
  InstagramIcon,
  XIcon,
  TikTokIcon
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/BrandIcons.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/BrowsePages.jsx
try { (() => {
// Dreamwall UI kit — Films & Series browse pages.
// Cinematic featured hero banner + functional filter bar (genre, year,
// duration, score) + poster grid (highest rated first). Series cards show
// season count; series page gets a featured-series banner.

// ---- featured hero banner ----
function BrowseHero({
  film,
  kicker,
  onOpen
}) {
  if (!film) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      marginBottom: 34,
      minHeight: 360,
      background: 'var(--bg-inset)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      width: '62%',
      background: `linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 165%)`,
      WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 46%, rgba(0,0,0,0) 100%)',
      maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 46%, rgba(0,0,0,0) 100%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(90deg, var(--bg-inset) 8%, rgba(5,5,5,0.45) 44%, transparent 72%),' + 'linear-gradient(to top, var(--bg-inset) 2%, transparent 30%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      opacity: 0.4,
      backgroundImage: 'radial-gradient(rgba(245,243,239,0.05) 1px, transparent 1px)',
      backgroundSize: '5px 5px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      padding: '48px 52px',
      maxWidth: 560
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "overline",
    style: {
      color: 'var(--coral-bright)'
    }
  }, kicker), /*#__PURE__*/React.createElement(ContentBadge, {
    type: film.type
  }), /*#__PURE__*/React.createElement(ContentRibbon, {
    film: film,
    size: "sm"
  })), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: '700 46px/1.04 var(--font-display)',
      letterSpacing: '-0.015em',
      color: 'var(--fg-0)',
      margin: '0 0 14px'
    }
  }, film.title), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-lg)',
      color: 'var(--fg-1)',
      margin: '0 0 22px',
      maxWidth: 480
    }
  }, film.synopsis), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      marginBottom: 26,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(ScoreLine, {
    film: film,
    size: 30,
    countColor: "var(--fg-2)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 22,
      background: 'var(--border-default)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-data)',
      color: 'var(--fg-1)'
    }
  }, film.year), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-data)',
      color: 'var(--fg-1)'
    }
  }, film.seasons ? `${film.seasons} ${film.seasons === 1 ? 'season' : 'seasons'}` : film.runtime), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-data)',
      color: 'var(--fg-1)'
    }
  }, film.genres.join(' · '))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "play",
    onClick: () => onOpen(film)
  }, "View title"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    icon: "plus"
  }, "Watchlist"))));
}

// ---- custom filter dropdown ----
function FilterSelect({
  label,
  value,
  options,
  onChange
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const close = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  const active = value !== options[0];
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(o => !o),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 9,
      padding: '9px 14px',
      borderRadius: 'var(--radius-pill)',
      cursor: 'pointer',
      font: '600 13px/1 var(--font-body)',
      transition: 'all var(--dur-fast)',
      borderWidth: 1,
      borderStyle: 'solid',
      background: active ? 'var(--coral-ghost)' : 'var(--bg-1)',
      borderColor: active ? 'var(--border-accent)' : 'var(--border-default)',
      color: active ? 'var(--coral-bright)' : 'var(--fg-1)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: active ? 'var(--coral-bright)' : 'var(--fg-2)'
    }
  }, label, ":"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: active ? 'var(--coral-bright)' : 'var(--fg-0)'
    }
  }, value), /*#__PURE__*/React.createElement(Icon, {
    name: open ? 'caret-up' : 'caret-down',
    size: 12,
    color: "currentColor"
  })), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 'calc(100% + 6px)',
      left: 0,
      zIndex: 40,
      minWidth: 160,
      padding: 6,
      background: 'var(--bg-1)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-3)',
      maxHeight: 320,
      overflowY: 'auto'
    }
  }, options.map(opt => {
    const on = opt === value;
    return /*#__PURE__*/React.createElement("div", {
      key: opt,
      onClick: () => {
        onChange(opt);
        setOpen(false);
      },
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        padding: '9px 11px',
        cursor: 'pointer',
        borderRadius: 'var(--radius-md)',
        font: '500 13.5px/1 var(--font-body)',
        color: on ? 'var(--fg-0)' : 'var(--fg-1)',
        background: on ? 'var(--bg-2)' : 'transparent'
      },
      onMouseEnter: e => {
        if (!on) e.currentTarget.style.background = 'var(--bg-2)';
      },
      onMouseLeave: e => {
        if (!on) e.currentTarget.style.background = 'transparent';
      }
    }, opt, on && /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 14,
      color: "var(--coral-bright)"
    }));
  })));
}

// ---- richer browse poster card (score always visible, season pill for series) ----
function BrowseCard({
  film,
  onOpen
}) {
  const [hover, setHover] = React.useState(false);
  const aspect = film.type === 'vertical' ? '9/16' : '2/3';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      cursor: 'pointer'
    },
    onClick: () => onOpen && onOpen(film),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: aspect,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      position: 'relative',
      boxShadow: 'var(--shadow-poster)',
      background: `linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 150%)`,
      transition: 'transform var(--dur-base) var(--ease-out), filter var(--dur-base) var(--ease-out)',
      transform: hover ? 'translateY(-3px) scale(1.015)' : 'none',
      filter: hover ? 'brightness(1.08)' : 'brightness(1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 10,
      left: 10,
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(ContentRibbon, {
    film: film,
    size: "sm"
  }), /*#__PURE__*/React.createElement(ContentBadge, {
    type: film.type,
    solid: true,
    size: "sm"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 10,
      right: 10,
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, film.seasons != null && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '4px 9px',
      borderRadius: 'var(--radius-pill)',
      background: 'rgba(10,10,10,0.6)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      font: '600 11px/1 var(--font-mono)',
      color: 'var(--teal-bright)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "stack",
    size: 11,
    color: "var(--teal-bright)"
  }), film.seasons, " ", film.seasons === 1 ? 'SEASON' : 'SEASONS'), /*#__PURE__*/React.createElement("div", {
    style: {
      opacity: hover ? 1 : 0,
      transition: 'opacity var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement(WatchlistButton, {
    film: film
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      padding: '30px 12px 11px',
      background: 'linear-gradient(to top, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.3) 60%, transparent 100%)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(ScoreLine, {
    film: film,
    size: 23,
    countColor: "rgba(255,255,255,0.7)"
  }), film.seasons == null && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      font: '600 11px/1 var(--font-mono)',
      color: 'rgba(255,255,255,0.82)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 11,
    color: "rgba(255,255,255,0.6)"
  }), formatDuration(film)))), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 14px/1.25 var(--font-body)',
      color: 'var(--fg-0)',
      marginTop: 10,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, film.title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)',
      marginTop: 3
    }
  }, film.year, " \xB7 ", film.genres[0]));
}

// ---- shared browse page (parameterized for Films vs Series) ----
function BrowsePage({
  pool,
  kicker,
  durationOptions,
  durationMatch,
  onOpen
}) {
  const [genre, setGenre] = React.useState('All genres');
  const [year, setYear] = React.useState('All years');
  const [duration, setDuration] = React.useState(durationOptions[0]);
  const [score, setScore] = React.useState('Any score');
  const [sort, setSort] = React.useState('Highest rated');
  // brief loading skeleton on mount + whenever filters change (simulated fetch)
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 620);
    return () => clearTimeout(t);
  }, [genre, year, duration, score, sort]);
  const genres = ['All genres', ...Array.from(new Set(pool.flatMap(f => f.genres))).sort()];
  const years = ['All years', ...Array.from(new Set(pool.map(f => f.year))).sort((a, b) => b - a).map(String)];
  const scores = ['Any score', '9.0+', '8.0+', '7.0+', '6.0+'];
  const sorts = ['Highest rated', 'Newest', 'Most rated'];
  const ratingNum = f => parseFloat(String(f.ratings)) * (String(f.ratings).includes('k') ? 1000 : 1);
  let shown = pool.filter(f => {
    if (genre !== 'All genres' && !f.genres.includes(genre)) return false;
    if (year !== 'All years' && String(f.year) !== year) return false;
    if (score !== 'Any score' && f.score < parseFloat(score)) return false;
    if (duration !== durationOptions[0] && !durationMatch(f, duration)) return false;
    return true;
  });
  shown = shown.slice().sort((a, b) => sort === 'Newest' ? b.year - a.year : sort === 'Most rated' ? ratingNum(b) - ratingNum(a) : b.score - a.score);
  const featured = pool.slice().sort((a, b) => b.score - a.score)[0];
  const reset = () => {
    setGenre('All genres');
    setYear('All years');
    setDuration(durationOptions[0]);
    setScore('Any score');
  };
  const anyActive = genre !== 'All genres' || year !== 'All years' || duration !== durationOptions[0] || score !== 'Any score';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: '0 auto',
      padding: '28px 28px 90px'
    }
  }, /*#__PURE__*/React.createElement(BrowseHero, {
    film: featured,
    kicker: kicker,
    onOpen: onOpen
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap',
      marginBottom: 26
    }
  }, /*#__PURE__*/React.createElement(FilterSelect, {
    label: "Genre",
    value: genre,
    options: genres,
    onChange: setGenre
  }), /*#__PURE__*/React.createElement(FilterSelect, {
    label: "Year",
    value: year,
    options: years,
    onChange: setYear
  }), /*#__PURE__*/React.createElement(FilterSelect, {
    label: "Duration",
    value: duration,
    options: durationOptions,
    onChange: setDuration
  }), /*#__PURE__*/React.createElement(FilterSelect, {
    label: "Score",
    value: score,
    options: scores,
    onChange: setScore
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), anyActive && /*#__PURE__*/React.createElement("button", {
    onClick: reset,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      font: '600 13px/1 var(--font-body)',
      color: 'var(--fg-2)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 13,
    color: "var(--fg-2)"
  }), " Clear"), /*#__PURE__*/React.createElement(FilterSelect, {
    label: "Sort",
    value: sort,
    options: sorts,
    onChange: setSort
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)',
      marginBottom: 18
    }
  }, loading ? 'Loading titles…' : `${shown.length} ${shown.length === 1 ? 'title' : 'titles'}`), loading ? /*#__PURE__*/React.createElement(SkeletonGrid, {
    count: 10,
    min: 176
  }) : shown.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(176px, 1fr))',
      gap: 24
    }
  }, shown.map(f => /*#__PURE__*/React.createElement(BrowseCard, {
    key: f.id,
    film: f,
    onOpen: onOpen
  }))) : /*#__PURE__*/React.createElement(EmptyState, {
    icon: "funnel-x",
    accent: "var(--teal)",
    compact: true,
    title: "No titles match these filters",
    sub: "Try loosening a filter or two \u2014 there\u2019s plenty more in the catalog.",
    actionLabel: "Clear filters",
    onAction: reset
  }));
}
function FilmsPage({
  onOpen
}) {
  const pool = window.AICDB_FILMS.filter(f => f.type === 'movie' || f.type === 'short' || f.type === 'vertical');
  const mins = f => parseInt(String(f.runtime).replace(/[^0-9]/g, ''), 10) || 0;
  return /*#__PURE__*/React.createElement(BrowsePage, {
    pool: pool,
    kicker: "Featured film",
    onOpen: onOpen,
    durationOptions: ['Any length', 'Under 30 min', '30–90 min', '90–120 min', 'Over 2 hrs'],
    durationMatch: (f, d) => {
      const m = mins(f);
      return d === 'Under 30 min' ? m < 30 : d === '30–90 min' ? m >= 30 && m <= 90 : d === '90–120 min' ? m > 90 && m <= 120 : d === 'Over 2 hrs' ? m > 120 : true;
    }
  });
}
function SeriesPage({
  onOpen
}) {
  const pool = window.AICDB_FILMS.filter(f => f.type === 'series');
  return /*#__PURE__*/React.createElement(BrowsePage, {
    pool: pool,
    kicker: "Featured series",
    onOpen: onOpen,
    durationOptions: ['Any length', '1 season', '2 seasons', '3+ seasons'],
    durationMatch: (f, d) => d === '1 season' ? f.seasons === 1 : d === '2 seasons' ? f.seasons === 2 : d === '3+ seasons' ? f.seasons >= 3 : true
  });
}
Object.assign(window, {
  BrowseHero,
  FilterSelect,
  BrowseCard,
  BrowsePage,
  FilmsPage,
  SeriesPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/BrowsePages.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/Creator.jsx
try { (() => {
// Dreamwall UI kit — Creator Page (separate from the regular user Profile).
// Only users who have switched to a creator account get this page.
// Assembles: NavBar + centered cinematic hero + stat strip + Works grid +
// About section + (creator-only) Creator Studio management panel.
// Reuses CreatorParts.jsx, CreatorManage.jsx, Primitives, FilmCard, NavBar.

// ---- the creator + their catalog (fictional, mockup data) ----
const CREATOR = {
  name: 'Maya Okonkwo',
  initials: 'M',
  location: 'Lagos · Berlin',
  joined: 'Creating since 2023',
  avatar: ['#d85a30', '#9d8df1'],
  // gradient fallback if no avatarImg
  avatarImg: null,
  banner: null,
  // gradient placeholder if null
  followers: 48200,
  manifesto: "I don't generate films — I haunt them into existence. Every frame is a memory I haven't had yet. Diffusion is just the séance.",
  social: {
    youtube: '#',
    instagram: '#',
    x: '#',
    tiktok: '#',
    website: '#'
  },
  tools: ['Runway Gen-3', 'Sora', 'Midjourney v6', 'ElevenLabs', 'Kling 1.5', 'Topaz', 'DaVinci Resolve'],
  influences: ['Wong Kar-wai', 'Tarkovsky', 'Hideaki Anno', 'Neo-noir', 'Liminal spaces', 'Saul Bass'],
  notes: "Currently deep in a feature-length piece about a city that dreams its own residents.\n\nOpen to scoring collaborations and prompt-architecture residencies. If you've trained a grain model you're proud of, my inbox is always open — I'm hunting for the texture of 16mm rendered in latent space.\n\nNo NFTs. Don't ask.",
  // works the creator has published (ids into AICDB_FILMS)
  works: ['echoes-of-tomorrow', 'glass-orchard', 'synthetic-dreams', 'the-long-render', 'redshift', 'paper-suns']
};

// drafts in progress (creator-only studio)
const DRAFTS = [{
  title: 'The City That Dreams (feature)',
  edited: '2 hours ago',
  pct: 72
}, {
  title: 'Untitled — Lagos 2099',
  edited: '4 days ago',
  pct: 41
}, {
  title: 'Grain Study #7 (short)',
  edited: '3 weeks ago',
  pct: 18
}];

// ---- build a creator object from a stored (user-created) creator account ----
function creatorFromAccount(acct) {
  return {
    accountId: acct.id,
    name: acct.name || 'Untitled Creator',
    initials: (acct.name || 'C').replace(/[@]/g, '').trim().charAt(0).toUpperCase() || 'C',
    location: acct.location || 'Online',
    joined: 'Joined just now',
    avatar: acct.avatar || ['#d85a30', '#9d8df1'],
    avatarImg: acct.avatarImg || null,
    banner: acct.banner || null,
    followers: acct.followers || 0,
    verified: false,
    manifesto: acct.bio || 'A brand-new creator. The first frame is still rendering.',
    social: acct.social || {
      youtube: '#',
      instagram: '#',
      x: '#',
      tiktok: '#',
      website: '#'
    },
    tools: acct.tools && acct.tools.length ? acct.tools : ['Add your tools in Edit This Page'],
    influences: acct.influences && acct.influences.length ? acct.influences : ['Add your influences'],
    notes: acct.notes || 'You haven’t written any notes yet. Hit “Edit This Page” to introduce yourself.',
    works: [],
    isOwn: true
  };
}

// ---- resolve which creator to show: ?account= (created), ?name= (registry), else default ----
function resolveCreator() {
  let params = {};
  try {
    params = new URLSearchParams(window.location.search);
  } catch (e) {}
  const accountId = params.get && params.get('account');
  const name = params.get && params.get('name');
  if (accountId && window.AICDB_CREATOR_ACCOUNTS) {
    const acct = window.AICDB_CREATOR_ACCOUNTS.byId(accountId);
    if (acct) return creatorFromAccount(acct);
  }
  if (!name) return CREATOR;
  const reg = window.AICDB_CREATOR_BY_NAME ? window.AICDB_CREATOR_BY_NAME[name] : null;
  if (!reg) return CREATOR;
  if (reg.name === CREATOR.name) return CREATOR; // rich hand-authored default (Maya)
  const works = window.AICDB_FILMS.filter(f => f.creator === reg.name).map(f => f.id);
  const handleClean = reg.handle ? reg.handle.replace('@', '') : reg.name;
  return {
    name: reg.name,
    initials: reg.name.replace(/[@]/g, '').trim().charAt(0).toUpperCase() || 'A',
    location: reg.location || 'Online',
    joined: 'Creating since 2023',
    avatar: reg.av || ['#d85a30', '#9d8df1'],
    avatarImg: null,
    banner: null,
    followers: reg.followers || 0,
    verified: reg.verified,
    manifesto: reg.tagline,
    social: {
      youtube: '#',
      instagram: '#',
      x: '#',
      tiktok: '#',
      website: '#'
    },
    tools: ['Runway Gen-3', 'Sora', 'Midjourney v6', 'ElevenLabs', 'DaVinci Resolve'],
    influences: ['Cinema', 'Liminal spaces', 'Sound design', 'Neo-noir'],
    notes: `${reg.tagline}\n\nOpen to scoring collaborations and prompt-architecture residencies. Reach out via @${handleClean}.`,
    works
  };
}
function filmsById() {
  const m = {};
  window.AICDB_FILMS.forEach(f => {
    m[f.id] = f;
  });
  return m;
}

// ---- a Works poster: title, year, score + type badge always visible ----
function WorkCard({
  film,
  onOpen
}) {
  const [hover, setHover] = React.useState(false);
  const aspect = film.type === 'vertical' ? '9/16' : '2/3';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      cursor: 'pointer'
    },
    onClick: () => onOpen && onOpen(film),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: aspect,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      position: 'relative',
      boxShadow: 'var(--shadow-poster)',
      background: `linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 150%)`,
      transition: 'transform var(--dur-base) var(--ease-out), filter var(--dur-base) var(--ease-out)',
      transform: hover ? 'translateY(-3px) scale(1.015)' : 'none',
      filter: hover ? 'brightness(1.08)' : 'brightness(1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 10,
      left: 10,
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(ContentRibbon, {
    film: film,
    size: "sm"
  }), /*#__PURE__*/React.createElement(ContentBadge, {
    type: film.type,
    solid: true,
    size: "sm"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      padding: '28px 12px 11px',
      background: 'linear-gradient(to top, rgba(5,5,5,0.85) 0%, rgba(5,5,5,0.35) 55%, transparent 100%)',
      display: 'flex',
      alignItems: 'baseline',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(ScoreLine, {
    film: film,
    size: 22,
    countColor: "rgba(255,255,255,0.7)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 14px/1.25 var(--font-body)',
      color: 'var(--fg-0)',
      marginTop: 10,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, film.title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)',
      marginTop: 3
    }
  }, film.year, " \xB7 ", window.AICDB_TYPES[film.type].label));
}

// ---- Works section: tab filter (All / Films / Series / Shorts) + grid ----
function WorksSection({
  films,
  onOpen
}) {
  const [tab, setTab] = React.useState('All');
  const tabs = [['All', () => true], ['Films', f => f.type === 'movie'], ['Series', f => f.type === 'series'], ['Shorts', f => f.type === 'short']];
  const counts = {};
  tabs.forEach(([label, pred]) => {
    counts[label] = films.filter(pred).length;
  });
  const pred = tabs.find(t => t[0] === tab)[1];
  const shown = films.filter(pred).slice().sort((a, b) => b.score - a.score); // highest rated first

  return /*#__PURE__*/React.createElement("section", {
    style: {
      marginBottom: 64
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 20,
      flexWrap: 'wrap',
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--text-h2)',
      color: 'var(--fg-0)',
      letterSpacing: '-0.01em'
    }
  }, "Works"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, tabs.map(([label]) => {
    const on = tab === label;
    return /*#__PURE__*/React.createElement("button", {
      key: label,
      onClick: () => setTab(label),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '8px 15px',
        borderRadius: 'var(--radius-pill)',
        cursor: 'pointer',
        font: '600 13px/1 var(--font-body)',
        transition: 'all var(--dur-fast)',
        borderWidth: 1,
        borderStyle: 'solid',
        background: on ? 'var(--fg-0)' : 'transparent',
        borderColor: on ? 'transparent' : 'var(--border-default)',
        color: on ? 'var(--bg-0)' : 'var(--fg-1)'
      }
    }, label, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 11px/1 var(--font-mono)',
        color: on ? 'rgba(10,10,10,0.5)' : 'var(--fg-3)'
      }
    }, counts[label]));
  }))), shown.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(168px, 1fr))',
      gap: 24
    }
  }, shown.map(f => /*#__PURE__*/React.createElement(WorkCard, {
    key: f.id,
    film: f,
    onOpen: onOpen
  }))) : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '60px 0',
      textAlign: 'center',
      font: 'var(--text-body)',
      color: 'var(--fg-2)'
    }
  }, "Nothing here yet \u2014 this creator hasn't released a ", tab.toLowerCase().replace(/s$/, ''), "."));
}

// ---- humorous empty state: no creator account yet ----
function NoCreatorContent({
  onApp
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh'
    }
  }, /*#__PURE__*/React.createElement(NavBar, {
    active: "",
    onNav: onApp,
    query: "",
    onQuery: () => {},
    onOpenResult: () => {}
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 620,
      margin: '0 auto',
      padding: '80px 28px 90px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 104,
      height: 104,
      margin: '0 auto 28px',
      borderRadius: '50%',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-1)',
      border: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: '50%',
      background: 'radial-gradient(circle at 50% 35%, rgba(216,90,48,0.22), transparent 70%)'
    }
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "ghost",
    size: 46,
    color: "var(--coral-bright)",
    weight: "fill"
  })), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: '700 clamp(30px,5vw,42px)/1.08 var(--font-display)',
      letterSpacing: '-0.015em',
      color: 'var(--fg-0)',
      margin: '0 0 16px'
    }
  }, "A stunning body of work.", /*#__PURE__*/React.createElement("br", null), "Truly. Nothing."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-lg)',
      color: 'var(--fg-1)',
      margin: '0 auto 10px',
      maxWidth: 460
    }
  }, "We searched everywhere \u2014 under the render queue, behind the GPU, in the latent space. You haven\u2019t published a single frame."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body)',
      color: 'var(--fg-2)',
      margin: '0 auto 32px',
      maxWidth: 460
    }
  }, "That\u2019s because ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--fg-1)'
    }
  }, "My Contents"), " lives on a ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--fg-1)'
    }
  }, "creator account"), " \u2014 a separate identity you publish and get rated under. You don\u2019t have one yet. Want to fix that?"), /*#__PURE__*/React.createElement("a", {
    href: "Dreamwall%20Add%20Creator%20Account.html",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 9,
      padding: '14px 26px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--coral)',
      color: 'var(--fg-on-accent)',
      font: '600 15px/1 var(--font-body)',
      textDecoration: 'none',
      boxShadow: 'var(--shadow-1)'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--coral-bright)',
    onMouseLeave: e => e.currentTarget.style.background = 'var(--coral)'
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16,
    color: "var(--fg-on-accent)",
    weight: "bold"
  }), " Create a creator account"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => onApp && onApp(''),
    style: {
      cursor: 'pointer',
      font: '500 13px/1 var(--font-body)',
      color: 'var(--fg-3)'
    }
  }, "\u2190 Maybe later, back to browsing"))));
}

// ---- the page ----
function CreatorPage() {
  const accounts = useCreatorAccounts();
  const wantsManage = typeof window !== 'undefined' && /[?&]manage=1/.test(window.location.search);
  const [manage, setManage] = React.useState(wantsManage);
  let params = {};
  try {
    params = new URLSearchParams(window.location.search);
  } catch (e) {}
  const accountId = params.get && params.get('account');
  const name = params.get && params.get('name');
  const isMyContents = wantsManage && !name && !accountId;
  const open = f => {
    window.location.href = 'index.html';
  };
  const goApp = label => {
    window.location.href = 'index.html' + (label ? '#' + encodeURIComponent(label) : '');
  };

  // My Contents with no creator account → humorous empty state
  if (isMyContents && accounts.length === 0) {
    return /*#__PURE__*/React.createElement(NoCreatorContent, {
      onApp: goApp
    });
  }
  const creator = isMyContents ? creatorFromAccount(accounts[0]) : resolveCreator();
  const drafts = creator === CREATOR ? DRAFTS : [];
  const byId = filmsById();
  const works = creator.works.map(id => byId[id]).filter(Boolean);

  // derived stat strip
  const parseRatings = s => parseFloat(String(s)) * (String(s).includes('k') ? 1000 : String(s).includes('M') ? 1e6 : 1);
  const totalRatings = works.reduce((sum, f) => sum + parseRatings(f.ratings), 0);
  const totalViews = works.reduce((sum, f) => sum + window.AICDB_STAT(f).watched, 0);
  const avgScore = works.length ? works.reduce((sum, f) => sum + f.score, 0) / works.length : 0;
  const stats = [{
    label: 'Works',
    value: works.length,
    icon: 'film-slate',
    color: 'var(--coral-bright)'
  }, {
    label: 'Total Views',
    value: fmtCount(totalViews),
    icon: 'eye',
    color: 'var(--fg-1)'
  }, {
    label: 'Avg Score',
    value: works.length ? avgScore.toFixed(1) : '—',
    unit: works.length ? '/10' : '',
    icon: 'sparkle',
    color: 'var(--teal-bright)',
    scoreColor: works.length ? scoreColor(avgScore) : 'var(--fg-3)'
  }, {
    label: 'Ratings',
    value: fmtCount(totalRatings),
    icon: 'star',
    color: 'var(--coral-bright)'
  }, {
    label: 'Followers',
    value: fmtCount(creator.followers),
    icon: 'users-three',
    color: 'var(--fg-1)'
  }];

  // published rows for the studio panel
  const published = works.map(f => ({
    film: f,
    stat: window.AICDB_STAT(f)
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh'
    }
  }, /*#__PURE__*/React.createElement(NavBar, {
    active: "",
    onNav: goApp,
    query: "",
    onQuery: () => {},
    onOpenResult: () => {}
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: '0 auto',
      padding: '28px 28px 96px'
    }
  }, /*#__PURE__*/React.createElement(CreatorHero, {
    creator: creator,
    manage: manage,
    onToggleManage: setManage
  }), /*#__PURE__*/React.createElement(CreatorStatStrip, {
    items: stats
  }), manage && /*#__PURE__*/React.createElement(ManagePanel, {
    published: published,
    drafts: drafts
  }), /*#__PURE__*/React.createElement(WorksSection, {
    films: works,
    onOpen: open
  }), /*#__PURE__*/React.createElement(AboutSection, {
    creator: creator
  })));
}
Object.assign(window, {
  CreatorPage,
  NoCreatorContent,
  WorksSection,
  WorkCard,
  CREATOR,
  DRAFTS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/Creator.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/CreatorManage.jsx
try { (() => {
// Dreamwall UI kit — Creator Studio management panel (creator-only).
// Add New Content button + Published / Drafts tabs with per-item actions.

function StudioTab({
  label,
  count,
  active,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '9px 4px',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      font: '600 15px/1 var(--font-body)',
      color: active ? 'var(--fg-0)' : 'var(--fg-2)',
      borderBottomWidth: 2,
      borderBottomStyle: 'solid',
      borderBottomColor: active ? 'var(--coral)' : 'transparent',
      paddingBottom: 12,
      transition: 'color var(--dur-fast)'
    }
  }, label, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 11px/1 var(--font-mono)',
      padding: '3px 7px',
      borderRadius: 'var(--radius-pill)',
      background: active ? 'var(--coral-ghost)' : 'var(--bg-3)',
      color: active ? 'var(--coral-bright)' : 'var(--fg-2)'
    }
  }, count));
}
function PosterThumb({
  film
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 64,
      flex: 'none',
      borderRadius: 6,
      overflow: 'hidden',
      boxShadow: 'var(--shadow-1)',
      background: film ? `linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 160%)` : 'var(--bg-3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, !film && /*#__PURE__*/React.createElement(Icon, {
    name: "image",
    size: 16,
    color: "var(--fg-3)"
  }));
}
function StudioBtn({
  icon,
  children,
  danger,
  onClick
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '8px 13px',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      font: '600 12.5px/1 var(--font-body)',
      transition: 'all var(--dur-fast)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: danger ? h ? 'rgba(229,72,77,0.55)' : 'var(--border-subtle)' : h ? 'var(--border-strong)' : 'var(--border-subtle)',
      background: h ? danger ? 'rgba(229,72,77,0.1)' : 'var(--bg-2)' : 'transparent',
      color: danger ? 'var(--score-low)' : 'var(--fg-0)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 14,
    color: danger ? 'var(--score-low)' : 'var(--fg-1)'
  }), children);
}
function PublishedRow({
  film,
  stat
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '14px 18px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--bg-0)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(PosterThumb, {
    film: film
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 200px',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 15px/1.2 var(--font-body)',
      color: 'var(--fg-0)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, film.title), /*#__PURE__*/React.createElement(ContentBadge, {
    type: film.type,
    size: "sm"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)',
      marginTop: 5
    }
  }, film.year, " \xB7 Published")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 30,
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(StudioMetric, {
    icon: "eye",
    value: fmtCount(stat.watched),
    label: "Views"
  }), /*#__PURE__*/React.createElement(StudioMetric, {
    icon: "star",
    value: fmtCount(stat.rated),
    label: "Ratings"
  }), /*#__PURE__*/React.createElement(StudioMetric, {
    value: film.score.toFixed(1),
    label: "Score",
    score: film.score
  })), /*#__PURE__*/React.createElement(StudioBtn, {
    icon: "pencil"
  }, "Edit"));
}
function StudioMetric({
  icon,
  value,
  label,
  score
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      minWidth: 58
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 17px/1 var(--font-mono)',
      color: score != null ? scoreColor(score) : 'var(--fg-0)'
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      color: 'var(--fg-2)',
      marginTop: 5
    }
  }, label));
}
function DraftRow({
  draft
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '14px 18px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--bg-0)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(PosterThumb, {
    film: null
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 220px',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 15px/1.2 var(--font-body)',
      color: 'var(--fg-0)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, draft.title), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 10px/1 var(--font-body)',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      color: 'var(--type-short)',
      background: 'rgba(229,178,59,0.16)',
      padding: '4px 8px',
      borderRadius: 'var(--radius-pill)'
    }
  }, "Draft")), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)',
      marginTop: 5
    }
  }, "Edited ", draft.edited)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 'none',
      width: 150
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "overline",
    style: {
      color: 'var(--fg-2)'
    }
  }, "Complete"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 12px/1 var(--font-mono)',
      color: 'var(--fg-1)'
    }
  }, draft.pct, "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 6,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--rating-track)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: `${draft.pct}%`,
      borderRadius: 'var(--radius-pill)',
      background: draft.pct >= 66 ? 'var(--teal)' : draft.pct >= 33 ? 'var(--type-short)' : 'var(--coral)'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(StudioBtn, {
    icon: "pencil"
  }, "Edit"), /*#__PURE__*/React.createElement(StudioBtn, {
    icon: "trash",
    danger: true
  }, "Delete")));
}
function ManagePanel({
  published,
  drafts
}) {
  const [tab, setTab] = React.useState('Published');
  return /*#__PURE__*/React.createElement("section", {
    style: {
      marginBottom: 64,
      padding: '26px 28px',
      borderRadius: 'var(--radius-xl)',
      background: 'linear-gradient(180deg, rgba(216,90,48,0.05), transparent 40%), var(--bg-1)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 20,
      flexWrap: 'wrap',
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 9,
      marginBottom: 7
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sliders",
    size: 18,
    color: "var(--coral)"
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--text-h3)',
      color: 'var(--fg-0)'
    }
  }, "Creator Studio"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 10px/1 var(--font-body)',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'var(--fg-2)',
      background: 'var(--bg-3)',
      padding: '4px 8px',
      borderRadius: 'var(--radius-pill)'
    }
  }, "Only you")), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)',
      margin: 0
    }
  }, "Manage everything you've made and what's still cooking.")), /*#__PURE__*/React.createElement("a", {
    href: "add-content.html",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 9,
      padding: '13px 22px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--coral)',
      color: 'var(--fg-on-accent)',
      font: '600 14px/1 var(--font-body)',
      textDecoration: 'none',
      boxShadow: 'var(--shadow-1)'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--coral-bright)',
    onMouseLeave: e => e.currentTarget.style.background = 'var(--coral)'
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16,
    color: "var(--fg-on-accent)",
    weight: "bold"
  }), " Add New Content")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 26,
      marginTop: 20,
      marginBottom: 20,
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: 'var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(StudioTab, {
    label: "Published",
    count: published.length,
    active: tab === 'Published',
    onClick: () => setTab('Published')
  }), /*#__PURE__*/React.createElement(StudioTab, {
    label: "Drafts",
    count: drafts.length,
    active: tab === 'Drafts',
    onClick: () => setTab('Drafts')
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, tab === 'Published' ? published.map(p => /*#__PURE__*/React.createElement(PublishedRow, {
    key: p.film.id,
    film: p.film,
    stat: p.stat
  })) : drafts.map((d, i) => /*#__PURE__*/React.createElement(DraftRow, {
    key: i,
    draft: d
  }))));
}
Object.assign(window, {
  ManagePanel,
  PublishedRow,
  DraftRow,
  StudioTab,
  StudioBtn,
  StudioMetric,
  PosterThumb
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/CreatorManage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/CreatorParts.jsx
try { (() => {
// Dreamwall UI kit — Creator page building blocks.
// Centered cinematic hero (banner + overlapping avatar), social row, follow,
// horizontal stat strip, and the About section (tools / influences / notes).

// ---- Verified Creator badge ----
function VerifiedBadge() {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 12px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--teal-ghost)',
      color: 'var(--teal-bright)',
      font: '600 12px/1 var(--font-body)',
      letterSpacing: '0.03em',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'rgba(78,205,196,0.35)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "seal-check",
    size: 15,
    color: "var(--teal-bright)",
    weight: "fill"
  }), " Verified Creator");
}

// ---- social link button ----
function SocialLink({
  icon,
  label,
  href
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: href || '#',
    title: label,
    onClick: e => {
      if (!href || href === '#') e.preventDefault();
    },
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      width: 42,
      height: 42,
      flex: 'none',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: h ? 'var(--bg-2)' : 'var(--bg-1)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: h ? 'var(--border-strong)' : 'var(--border-subtle)',
      transition: 'all var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 19,
    color: h ? 'var(--fg-0)' : 'var(--fg-1)',
    weight: "fill"
  }));
}

// ---- follow button (toggles) ----
function FollowButton({
  count
}) {
  const [following, setFollowing] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const n = count + (following ? 1 : 0);
  const fmt = v => v >= 1000 ? (v / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(v);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setFollowing(f => !f),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '11px 22px',
      borderRadius: 'var(--radius-pill)',
      cursor: 'pointer',
      font: '600 14px/1 var(--font-body)',
      transition: 'all var(--dur-fast)',
      borderWidth: 1,
      borderStyle: 'solid',
      background: following ? 'transparent' : hover ? 'var(--coral-bright)' : 'var(--coral)',
      borderColor: following ? 'var(--border-strong)' : 'transparent',
      color: following ? 'var(--fg-0)' : 'var(--fg-on-accent)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: following ? 'check' : 'plus',
    size: 16,
    color: "currentColor",
    weight: "bold"
  }), following ? 'Following' : 'Follow'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 18px/1 var(--font-mono)',
      color: 'var(--fg-0)'
    }
  }, fmt(n)), /*#__PURE__*/React.createElement("span", {
    className: "overline",
    style: {
      color: 'var(--fg-2)'
    }
  }, "Followers")));
}

// ---- centered cinematic hero ----
function CreatorHero({
  creator,
  manage,
  onToggleManage
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginBottom: 140
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 380,
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      background: creator.banner ? `url(${creator.banner}) center/cover` : 'linear-gradient(125deg, #2a1410 0%, #241a3a 52%, #10302d 120%)'
    }
  }, !creator.banner && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(60% 120% at 22% 0%, rgba(216,90,48,0.30), transparent 55%),' + 'radial-gradient(55% 120% at 80% 8%, rgba(78,205,196,0.20), transparent 55%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      opacity: 0.5,
      backgroundImage: 'radial-gradient(rgba(245,243,239,0.05) 1px, transparent 1px)',
      backgroundSize: '5px 5px'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to bottom, rgba(10,10,10,0.05) 40%, rgba(10,10,10,0.55) 80%, var(--bg-0) 100%)'
    }
  }), manage && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 16,
      left: 16,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '9px 14px',
      background: 'rgba(10,10,10,0.5)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: 'var(--radius-pill)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'var(--border-default)',
      font: '600 12.5px/1 var(--font-body)',
      color: 'var(--fg-0)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "image",
    size: 15,
    color: "var(--fg-1)"
  }), " Change cover photo"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 16,
      right: 16,
      display: 'flex',
      gap: 3,
      padding: 3,
      borderRadius: 'var(--radius-pill)',
      background: 'rgba(10,10,10,0.5)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'var(--border-default)'
    }
  }, [['public', 'Public view'], ['manage', 'You (creator)']].map(([v, lbl]) => {
    const on = manage === (v === 'manage');
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      onClick: () => onToggleManage(v === 'manage'),
      style: {
        padding: '7px 13px',
        borderRadius: 'var(--radius-pill)',
        border: 'none',
        cursor: 'pointer',
        font: '600 12.5px/1 var(--font-body)',
        transition: 'all var(--dur-fast)',
        background: on ? 'var(--fg-0)' : 'transparent',
        color: on ? 'var(--bg-0)' : 'var(--fg-1)'
      }
    }, lbl);
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: -128,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      padding: '0 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 148,
      height: 148,
      borderRadius: '50%',
      flex: 'none',
      position: 'relative',
      background: creator.avatarImg ? `url(${creator.avatarImg}) center/cover` : `linear-gradient(135deg, ${creator.avatar[0]}, ${creator.avatar[1]})`,
      borderWidth: 4,
      borderStyle: 'solid',
      borderColor: 'var(--bg-0)',
      boxShadow: 'var(--shadow-3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, !creator.avatarImg && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 64px/1 var(--font-display)',
      color: 'rgba(255,255,255,0.92)'
    }
  }, creator.initials), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: '50%',
      boxShadow: 'inset 0 2px 18px rgba(255,255,255,0.22), inset 0 -12px 26px rgba(0,0,0,0.35)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      margin: '18px 0 0',
      flexWrap: 'wrap',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: '700 38px/1.05 var(--font-display)',
      letterSpacing: '-0.015em',
      color: 'var(--fg-0)',
      margin: 0
    }
  }, creator.name), creator.verified !== false && /*#__PURE__*/React.createElement(VerifiedBadge, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)',
      marginTop: 10,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: 13,
    color: "var(--fg-3)"
  }), creator.location, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-3)'
    }
  }, "\xB7"), creator.joined), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontWeight: 400,
      fontSize: 19,
      lineHeight: 1.5,
      color: 'var(--fg-1)',
      maxWidth: 600,
      margin: '20px 0 0'
    }
  }, "\u201C", creator.manifesto, "\u201D"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      margin: '26px 0 0',
      flexWrap: 'wrap',
      justifyContent: 'center'
    }
  }, manage ? /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      window.location.href = 'creator-setup.html' + (creator.accountId ? '?edit=' + encodeURIComponent(creator.accountId) : '');
    },
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '11px 22px',
      borderRadius: 'var(--radius-pill)',
      cursor: 'pointer',
      font: '600 14px/1 var(--font-body)',
      background: 'transparent',
      color: 'var(--fg-0)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'var(--border-strong)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = 'var(--border-accent)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = 'var(--border-strong)';
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pencil",
    size: 15,
    color: "var(--fg-1)"
  }), " Edit This Page") : /*#__PURE__*/React.createElement(FollowButton, {
    count: creator.followers
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(SocialLink, {
    icon: "youtube-logo",
    label: "YouTube",
    href: creator.social.youtube
  }), /*#__PURE__*/React.createElement(SocialLink, {
    icon: "instagram-logo",
    label: "Instagram",
    href: creator.social.instagram
  }), /*#__PURE__*/React.createElement(SocialLink, {
    icon: "x-logo",
    label: "X",
    href: creator.social.x
  }), /*#__PURE__*/React.createElement(SocialLink, {
    icon: "tiktok-logo",
    label: "TikTok",
    href: creator.social.tiktok
  }), /*#__PURE__*/React.createElement(SocialLink, {
    icon: "globe",
    label: "Website",
    href: creator.social.website
  })))));
}

// ---- horizontal stat strip ----
function CreatorStatStrip({
  items
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      background: 'var(--bg-1)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'var(--border-subtle)',
      marginBottom: 64
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: it.label
  }, i > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      alignSelf: 'stretch',
      background: 'var(--border-subtle)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 160px',
      padding: '24px 18px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 11
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: it.icon,
    size: 18,
    color: it.color,
    weight: "fill"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 30px/1 var(--font-mono)',
      color: it.scoreColor || 'var(--fg-0)',
      letterSpacing: '-0.02em'
    }
  }, it.value), it.unit && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 13px/1 var(--font-mono)',
      color: 'var(--fg-2)'
    }
  }, it.unit)), /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      marginTop: 9,
      color: 'var(--fg-2)'
    }
  }, it.label)))));
}

// ---- About: tools / influences / notes ----
function ToolChip({
  name
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 14px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--bg-2)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'var(--border-default)',
      font: '600 13px/1 var(--font-body)',
      color: 'var(--fg-0)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 14,
    color: "var(--teal-bright)"
  }), name);
}
function AboutSection({
  creator
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      marginBottom: 64
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--text-h2)',
      color: 'var(--fg-0)',
      letterSpacing: '-0.01em',
      marginBottom: 24
    }
  }, "About"), /*#__PURE__*/React.createElement("div", {
    className: "aicdb-about-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 20,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px 26px',
      background: 'var(--bg-1)',
      borderRadius: 'var(--radius-lg)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      color: 'var(--teal-bright)',
      marginBottom: 16
    }
  }, "Tools & Stack"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10
    }
  }, creator.tools.map(t => /*#__PURE__*/React.createElement(ToolChip, {
    key: t,
    name: t
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px 26px',
      background: 'var(--bg-1)',
      borderRadius: 'var(--radius-lg)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      color: 'var(--coral-bright)',
      marginBottom: 16
    }
  }, "Influences"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 9
    }
  }, creator.influences.map(inf => /*#__PURE__*/React.createElement("span", {
    key: inf,
    style: {
      padding: '8px 13px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--coral-ghost)',
      color: 'var(--coral-bright)',
      font: '600 13px/1 var(--font-body)'
    }
  }, inf))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '26px 28px',
      background: 'var(--bg-1)',
      borderRadius: 'var(--radius-lg)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      color: 'var(--fg-2)',
      marginBottom: 14
    }
  }, "Notes from the creator"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-lg)',
      color: 'var(--fg-1)',
      margin: 0,
      maxWidth: 760,
      whiteSpace: 'pre-line'
    }
  }, creator.notes)));
}
Object.assign(window, {
  VerifiedBadge,
  SocialLink,
  FollowButton,
  CreatorHero,
  CreatorStatStrip,
  ToolChip,
  AboutSection
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/CreatorParts.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/CreatorSetup.jsx
try { (() => {
// Dreamwall UI kit — Creator Account Setup.
// Shows the user's main account on top, then a form to create (or edit) a
// creator account: banner, photo, bio, location, social links, tools, influences,
// plus a toggle to show/hide the connection on the main profile. Users can run
// multiple creator accounts linked to one main account.

const GRADIENTS = [['#d85a30', '#9d8df1'], ['#4ecdc4', '#6f9ceb'], ['#e5b23b', '#4ecdc4'], ['#a04a8f', '#e5b23b'], ['#6b5bd0', '#9d8df1'], ['#3a8fb0', '#1a2b33'], ['#c44a2a', '#e5b23b'], ['#2f6f8f', '#4ecdc4']];

// ---- labelled text field ----
function Field({
  label,
  hint,
  value,
  onChange,
  placeholder,
  prefix
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "overline",
    style: {
      color: 'var(--fg-1)'
    }
  }, label), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-3)'
    }
  }, hint)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: 'var(--bg-0)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-default)',
      padding: '0 14px'
    }
  }, prefix && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 14px/1 var(--font-mono)',
      color: 'var(--fg-3)'
    }
  }, prefix), /*#__PURE__*/React.createElement("input", {
    value: value,
    onChange: e => onChange(e.target.value),
    placeholder: placeholder,
    style: {
      flex: 1,
      background: 'none',
      border: 'none',
      outline: 'none',
      color: 'var(--fg-0)',
      font: 'var(--text-body)',
      padding: '12px 0'
    }
  })));
}

// ---- multiline ----
function Area({
  label,
  value,
  onChange,
  placeholder,
  rows = 4
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      color: 'var(--fg-1)',
      marginBottom: 8
    }
  }, label), /*#__PURE__*/React.createElement("textarea", {
    value: value,
    onChange: e => onChange(e.target.value),
    placeholder: placeholder,
    rows: rows,
    style: {
      width: '100%',
      resize: 'vertical',
      background: 'var(--bg-0)',
      color: 'var(--fg-0)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      padding: '12px 14px',
      font: 'var(--text-body)',
      outline: 'none'
    }
  }));
}

// ---- tag / chip input (tools, influences) ----
function ChipInput({
  label,
  hint,
  chips,
  onChange,
  accent = 'var(--teal-bright)',
  ghost = 'var(--teal-ghost)'
}) {
  const [val, setVal] = React.useState('');
  const add = () => {
    const t = val.trim();
    if (t && !chips.includes(t)) onChange([...chips, t]);
    setVal('');
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "overline",
    style: {
      color: 'var(--fg-1)'
    }
  }, label), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-3)'
    }
  }, hint)), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-0)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      padding: '10px 12px'
    }
  }, chips.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 10
    }
  }, chips.map(c => /*#__PURE__*/React.createElement("span", {
    key: c,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      padding: '6px 10px',
      borderRadius: 'var(--radius-pill)',
      background: ghost,
      color: accent,
      font: '600 12.5px/1 var(--font-body)'
    }
  }, c, /*#__PURE__*/React.createElement("button", {
    onClick: () => onChange(chips.filter(x => x !== c)),
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 12,
    color: accent
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: val,
    onChange: e => setVal(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        add();
      }
    },
    placeholder: "Type and press Enter\u2026",
    style: {
      flex: 1,
      background: 'none',
      border: 'none',
      outline: 'none',
      color: 'var(--fg-0)',
      font: 'var(--text-body-sm)'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: add,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '6px 11px',
      borderRadius: 'var(--radius-pill)',
      border: '1px solid var(--border-default)',
      background: 'transparent',
      color: 'var(--fg-1)',
      cursor: 'pointer',
      font: '600 12px/1 var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 12,
    color: "var(--fg-2)"
  }), " Add"))));
}

// ---- toggle ----
function SetupToggle({
  on,
  onChange
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => onChange(!on),
    role: "switch",
    "aria-checked": on,
    style: {
      width: 46,
      height: 26,
      flex: 'none',
      borderRadius: 'var(--radius-pill)',
      border: 'none',
      cursor: 'pointer',
      padding: 3,
      display: 'flex',
      alignItems: 'center',
      background: on ? 'var(--teal)' : 'var(--bg-3)',
      justifyContent: on ? 'flex-end' : 'flex-start',
      transition: 'background var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      borderRadius: '50%',
      background: on ? '#04201e' : 'var(--fg-2)',
      boxShadow: 'var(--shadow-1)'
    }
  }));
}

// ---- section wrapper ----
function SetupCard({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px 26px',
      background: 'var(--bg-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      ...style
    }
  }, children);
}

// ---- main (viewer) account card ----
function MainAccountCard() {
  const m = window.AICDB_MAIN_ACCOUNT;
  return /*#__PURE__*/React.createElement(SetupCard, {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 54,
      height: 54,
      borderRadius: '50%',
      flex: 'none',
      background: `linear-gradient(135deg, ${m.avatar[0]}, ${m.avatar[1]})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      font: '600 22px/1 var(--font-display)',
      color: 'rgba(255,255,255,0.92)'
    }
  }, m.name.charAt(0)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 17px/1.2 var(--font-display)',
      color: 'var(--fg-0)'
    }
  }, m.name), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 9px/1 var(--font-body)',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      color: 'var(--fg-2)',
      background: 'var(--bg-3)',
      padding: '4px 8px',
      borderRadius: 'var(--radius-pill)'
    }
  }, "Main account")), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)',
      marginTop: 4
    }
  }, m.handle, " \xB7 ", m.joined)), /*#__PURE__*/React.createElement(Icon, {
    name: "link-simple",
    size: 18,
    color: "var(--fg-3)"
  }));
}

// ---- existing creator accounts (multi-account) ----
function ExistingAccounts({
  accounts,
  editingId
}) {
  if (!accounts.length) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 30
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      color: 'var(--fg-2)',
      margin: '0 2px 12px'
    }
  }, "Your creator accounts \xB7 ", accounts.length), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, accounts.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '12px 16px',
      background: 'var(--bg-1)',
      border: '1px solid ' + (a.id === editingId ? 'var(--border-accent)' : 'var(--border-subtle)'),
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 42,
      height: 42,
      borderRadius: '50%',
      flex: 'none',
      background: `linear-gradient(135deg, ${(a.avatar || ['#d85a30', '#9d8df1'])[0]}, ${(a.avatar || ['#d85a30', '#9d8df1'])[1]})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      font: '600 17px/1 var(--font-display)',
      color: 'rgba(255,255,255,0.92)'
    }
  }, (a.name || 'C').charAt(0).toUpperCase()), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 14.5px/1.2 var(--font-body)',
      color: 'var(--fg-0)'
    }
  }, a.name), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)',
      marginTop: 3
    }
  }, a.handle || '—', a.showOnProfile ? ' · shown on profile' : ' · hidden')), /*#__PURE__*/React.createElement("a", {
    href: 'creator.html?account=' + encodeURIComponent(a.id),
    style: {
      font: '600 13px/1 var(--font-body)',
      color: 'var(--teal)',
      textDecoration: 'none'
    }
  }, "View"), /*#__PURE__*/React.createElement("a", {
    href: 'creator-setup.html?edit=' + encodeURIComponent(a.id),
    style: {
      font: '600 13px/1 var(--font-body)',
      color: 'var(--fg-1)',
      textDecoration: 'none'
    }
  }, "Edit")))));
}

// ---- the page ----
function CreatorSetup() {
  const accounts = useCreatorAccounts();
  let editId = null;
  try {
    editId = new URLSearchParams(window.location.search).get('edit');
  } catch (e) {}
  const editing = editId ? window.AICDB_CREATOR_ACCOUNTS.byId(editId) : null;
  const [name, setName] = React.useState(editing ? editing.name : '');
  const [handle, setHandle] = React.useState(editing ? (editing.handle || '').replace(/^@/, '') : '');
  const [location, setLocation] = React.useState(editing ? editing.location || '' : '');
  const [bio, setBio] = React.useState(editing ? editing.bio || '' : '');
  const [avatar, setAvatar] = React.useState(editing ? editing.avatar || GRADIENTS[0] : GRADIENTS[0]);
  const [social, setSocial] = React.useState(editing ? editing.social || {} : {});
  const [tools, setTools] = React.useState(editing ? editing.tools || [] : []);
  const [influences, setInfluences] = React.useState(editing ? editing.influences || [] : []);
  const [notes, setNotes] = React.useState(editing ? editing.notes || '' : '');
  const [showOnProfile, setShowOnProfile] = React.useState(editing ? editing.showOnProfile !== false : true);
  const setSoc = k => v => setSocial(s => ({
    ...s,
    [k]: v
  }));
  const canSave = name.trim().length > 0;
  const save = () => {
    if (!canSave) return;
    const payload = {
      name: name.trim(),
      handle: handle.trim() ? '@' + handle.trim().replace(/^@/, '') : '',
      location: location.trim(),
      bio: bio.trim(),
      avatar,
      banner: null,
      social,
      tools,
      influences,
      notes: notes.trim(),
      showOnProfile
    };
    let id = editId;
    if (editing) window.AICDB_CREATOR_ACCOUNTS.update(editId, payload);else {
      const rec = window.AICDB_CREATOR_ACCOUNTS.add(payload);
      id = rec.id;
    }
    window.location.href = 'creator.html?account=' + encodeURIComponent(id) + (editing ? '' : '&manage=1');
  };
  const goApp = label => {
    window.location.href = 'index.html' + (label ? '#' + encodeURIComponent(label) : '');
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh'
    }
  }, /*#__PURE__*/React.createElement(NavBar, {
    active: "",
    onNav: goApp,
    query: "",
    onQuery: () => {},
    onOpenResult: () => {}
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 720,
      margin: '0 auto',
      padding: '40px 28px 90px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--text-h1)',
      color: 'var(--fg-0)',
      letterSpacing: '-0.015em',
      margin: 0
    }
  }, editing ? 'Edit creator account' : 'Set up a creator account'), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body)',
      color: 'var(--fg-2)',
      margin: '8px 0 0'
    }
  }, "A creator account is the identity you publish and get rated under. It\u2019s linked to your main account \u2014 you can run as many as you like.")), /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      color: 'var(--fg-2)',
      margin: '0 2px 12px'
    }
  }, "Linked to"), /*#__PURE__*/React.createElement(MainAccountCard, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      margin: '2px 0 18px'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-down",
    size: 18,
    color: "var(--fg-3)"
  })), !editing && /*#__PURE__*/React.createElement(ExistingAccounts, {
    accounts: accounts,
    editingId: editId
  }), /*#__PURE__*/React.createElement(SetupCard, {
    style: {
      padding: 0,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 150,
      background: `linear-gradient(125deg, ${avatar[0]}33, ${avatar[1]}22), var(--bg-2)`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 9,
      color: 'var(--fg-2)',
      font: '600 13px/1 var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "image",
    size: 16,
    color: "var(--fg-2)"
  }), " Add a banner image"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 26,
      bottom: -34,
      width: 84,
      height: 84,
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${avatar[0]}, ${avatar[1]})`,
      border: '4px solid var(--bg-1)',
      boxShadow: 'var(--shadow-2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "camera",
    size: 20,
    color: "rgba(255,255,255,0.9)",
    weight: "fill"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '46px 26px 26px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      color: 'var(--fg-1)',
      marginBottom: 10
    }
  }, "Profile photo color"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, GRADIENTS.map((g, i) => {
    const on = g[0] === avatar[0] && g[1] === avatar[1];
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: () => setAvatar(g),
      title: "Use this color",
      style: {
        width: 34,
        height: 34,
        borderRadius: '50%',
        cursor: 'pointer',
        padding: 0,
        background: `linear-gradient(135deg, ${g[0]}, ${g[1]})`,
        border: '2px solid ' + (on ? 'var(--fg-0)' : 'transparent'),
        boxShadow: on ? '0 0 0 2px var(--bg-1)' : 'none'
      }
    });
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    },
    className: "aicdb-setup-grid"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Display name",
    value: name,
    onChange: setName,
    placeholder: "e.g. Nova Pictures"
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Handle",
    prefix: "@",
    value: handle,
    onChange: setHandle,
    placeholder: "novapictures"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Location",
    hint: "optional",
    value: location,
    onChange: setLocation,
    placeholder: "e.g. Reykjav\xEDk"
  }), /*#__PURE__*/React.createElement(Area, {
    label: "Bio / manifesto",
    value: bio,
    onChange: setBio,
    placeholder: "What do you make, and why? This shows under your name.",
    rows: 3
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      color: 'var(--fg-1)',
      marginBottom: 10
    }
  }, "Social links ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-3)',
      textTransform: 'none',
      letterSpacing: 0
    }
  }, "\xB7 optional")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12
    },
    className: "aicdb-setup-grid"
  }, [['youtube', 'YouTube', 'youtube-logo'], ['instagram', 'Instagram', 'instagram-logo'], ['x', 'X', 'x-logo'], ['tiktok', 'TikTok', 'tiktok-logo'], ['website', 'Website', 'globe']].map(([k, lbl, icon]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: 'var(--bg-0)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-default)',
      padding: '0 12px'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 16,
    color: "var(--fg-2)",
    weight: "fill"
  }), /*#__PURE__*/React.createElement("input", {
    value: social[k] || '',
    onChange: e => setSoc(k)(e.target.value),
    placeholder: lbl,
    style: {
      flex: 1,
      background: 'none',
      border: 'none',
      outline: 'none',
      color: 'var(--fg-0)',
      font: 'var(--text-body-sm)',
      padding: '11px 0'
    }
  }))))), /*#__PURE__*/React.createElement(ChipInput, {
    label: "Tools & stack",
    hint: "press Enter to add",
    chips: tools,
    onChange: setTools,
    accent: "var(--teal-bright)",
    ghost: "var(--teal-ghost)"
  }), /*#__PURE__*/React.createElement(ChipInput, {
    label: "Influences",
    hint: "press Enter to add",
    chips: influences,
    onChange: setInfluences,
    accent: "var(--coral-bright)",
    ghost: "var(--coral-ghost)"
  }), /*#__PURE__*/React.createElement(Area, {
    label: "Notes from the creator",
    value: notes,
    onChange: setNotes,
    placeholder: "Anything else visitors should know (optional).",
    rows: 3
  }), /*#__PURE__*/React.createElement("div", {
    className: "aicdb-pref-row",
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 20,
      padding: '16px 18px',
      background: 'var(--bg-0)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 14.5px/1.3 var(--font-body)',
      color: 'var(--fg-0)'
    }
  }, "Show this creator account on my main profile"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)',
      marginTop: 4
    }
  }, "Visitors to your main profile will see a link to this creator page.")), /*#__PURE__*/React.createElement(SetupToggle, {
    on: showOnProfile,
    onChange: setShowOnProfile
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 12,
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "index.html",
    style: {
      font: '600 14px/1 var(--font-body)',
      color: 'var(--fg-2)',
      textDecoration: 'none',
      padding: '13px 18px'
    }
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    onClick: save,
    disabled: !canSave,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 9,
      padding: '14px 26px',
      borderRadius: 'var(--radius-md)',
      border: 'none',
      cursor: canSave ? 'pointer' : 'not-allowed',
      font: '600 15px/1 var(--font-body)',
      background: canSave ? 'var(--coral)' : 'var(--bg-3)',
      color: canSave ? 'var(--fg-on-accent)' : 'var(--fg-3)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: editing ? 'check' : 'plus',
    size: 16,
    color: canSave ? 'var(--fg-on-accent)' : 'var(--fg-3)',
    weight: "bold"
  }), editing ? 'Save changes' : 'Create creator account'))));
}
Object.assign(window, {
  CreatorSetup,
  CreatorSetupField: Field,
  ChipInput,
  SetupToggle
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/CreatorSetup.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/CreatorsPage.jsx
try { (() => {
// Dreamwall UI kit — Creators page.
// Featured "Creator of the week" hero + grid of creator cards
// (photo, name, follower count, total works, avg score, Follow).
// Reuses FollowPill + Seal from Feed.jsx.

// ---- a single stat cell for cards ----
function MiniStat({
  value,
  label,
  color
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 18px/1 var(--font-mono)',
      color: color || 'var(--fg-0)',
      letterSpacing: '-0.01em'
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      color: 'var(--fg-2)',
      marginTop: 6
    }
  }, label));
}

// ---- featured creator of the week ----
function FeaturedCreator({
  creator,
  onCreator,
  onOpen
}) {
  const st = window.AICDB_CREATOR_STATS(creator);
  const topWorks = st.films.slice().sort((a, b) => b.score - a.score).slice(0, 5);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      marginBottom: 44,
      background: `linear-gradient(120deg, ${creator.av[0]}22, ${creator.av[1]}18 140%), var(--bg-1)`,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      opacity: 0.4,
      backgroundImage: 'radial-gradient(rgba(245,243,239,0.05) 1px, transparent 1px)',
      backgroundSize: '5px 5px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      gap: 34,
      padding: '40px 44px',
      flexWrap: 'wrap',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => onCreator && onCreator(creator.name),
    style: {
      flex: 'none',
      cursor: 'pointer',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 128,
      height: 128,
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${creator.av[0]}, ${creator.av[1]})`,
      borderWidth: 3,
      borderStyle: 'solid',
      borderColor: 'var(--bg-0)',
      boxShadow: 'var(--shadow-3)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 320px',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      color: 'var(--coral-bright)',
      marginBottom: 12,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trophy",
    size: 13,
    color: "var(--coral-bright)",
    weight: "fill"
  }), " Creator of the week"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 10,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: '700 38px/1.04 var(--font-display)',
      letterSpacing: '-0.015em',
      color: 'var(--fg-0)',
      margin: 0
    }
  }, creator.name), creator.verified && /*#__PURE__*/React.createElement(Seal, {
    size: 22
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 18,
      lineHeight: 1.5,
      color: 'var(--fg-1)',
      margin: '0 0 22px',
      maxWidth: 540
    }
  }, "\u201C", creator.tagline, "\u201D"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 26,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(FollowPill, {
    id: creator.id
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 18px/1 var(--font-mono)',
      color: 'var(--fg-0)'
    }
  }, fmtCount(creator.followers)), /*#__PURE__*/React.createElement("span", {
    className: "overline",
    style: {
      color: 'var(--fg-2)'
    }
  }, "Followers")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 18px/1 var(--font-mono)',
      color: 'var(--fg-0)'
    }
  }, st.works), /*#__PURE__*/React.createElement("span", {
    className: "overline",
    style: {
      color: 'var(--fg-2)'
    }
  }, "Works")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 18px/1 var(--font-mono)',
      color: scoreColor(st.avg)
    }
  }, st.avg.toFixed(1)), /*#__PURE__*/React.createElement("span", {
    className: "overline",
    style: {
      color: 'var(--fg-2)'
    }
  }, "Avg score"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 'none',
      display: 'flex',
      gap: 10
    }
  }, topWorks.map(f => /*#__PURE__*/React.createElement("div", {
    key: f.id,
    onClick: () => onOpen && onOpen(f),
    title: f.title,
    style: {
      width: 78,
      aspectRatio: '2/3',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      cursor: 'pointer',
      background: `linear-gradient(150deg, ${f.g[0]}, ${f.g[1]} 150%)`,
      boxShadow: 'var(--shadow-2)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      padding: '16px 6px 5px',
      background: 'linear-gradient(to top, rgba(5,5,5,0.85), transparent)',
      font: '700 12px/1 var(--font-mono)',
      color: scoreColor(f.score),
      textAlign: 'center'
    }
  }, f.score.toFixed(1)))))));
}

// ---- creator card for the grid ----
function CreatorCard({
  creator,
  onCreator,
  onOpen
}) {
  const [hover, setHover] = React.useState(false);
  const [worksOpen, setWorksOpen] = React.useState(false);
  const st = window.AICDB_CREATOR_STATS(creator);
  const top = st.films.slice().sort((a, b) => b.score - a.score).slice(0, 3);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--bg-1)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: hover ? 'var(--border-default)' : 'var(--border-subtle)',
      transition: 'border-color var(--dur-fast), transform var(--dur-base)',
      transform: hover ? 'translateY(-3px)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 84,
      display: 'flex',
      gap: 2,
      position: 'relative',
      background: 'var(--bg-inset)'
    }
  }, top.map(f => /*#__PURE__*/React.createElement("div", {
    key: f.id,
    onClick: () => onOpen && onOpen(f),
    style: {
      flex: 1,
      cursor: 'pointer',
      background: `linear-gradient(150deg, ${f.g[0]}, ${f.g[1]} 160%)`
    }
  })), !top.length && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: `linear-gradient(120deg, ${creator.av[0]}33, ${creator.av[1]}22)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to bottom, transparent 30%, var(--bg-1) 100%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 12,
      right: 12,
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement(CornerFollow, {
    id: creator.id
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 22px 22px',
      marginTop: -32,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => onCreator && onCreator(creator.name),
    style: {
      cursor: 'pointer',
      display: 'inline-block'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 64,
      height: 64,
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${creator.av[0]}, ${creator.av[1]})`,
      borderWidth: 3,
      borderStyle: 'solid',
      borderColor: 'var(--bg-1)',
      boxShadow: 'var(--shadow-2)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => onCreator && onCreator(creator.name),
    style: {
      font: '600 18px/1.2 var(--font-display)',
      color: 'var(--fg-0)',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, creator.name), creator.verified && /*#__PURE__*/React.createElement(Seal, {
    size: 15
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)',
      marginTop: 3
    }
  }, creator.handle, " \xB7 ", creator.location), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-1)',
      margin: '12px 0 0',
      minHeight: 38,
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    }
  }, creator.tagline), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      margin: '18px 0',
      padding: '14px 0',
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(MiniStat, {
    value: fmtCount(creator.followers),
    label: "Followers"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      background: 'var(--border-subtle)'
    }
  }), /*#__PURE__*/React.createElement(MiniStat, {
    value: st.works,
    label: "Works"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      background: 'var(--border-subtle)'
    }
  }), /*#__PURE__*/React.createElement(MiniStat, {
    value: st.avg.toFixed(1),
    label: "Avg score",
    color: scoreColor(st.avg)
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => setWorksOpen(true),
    style: {
      width: '100%',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: '11px 0',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      font: '600 14px/1 var(--font-body)',
      transition: 'all var(--dur-fast)',
      border: '1px solid var(--border-strong)',
      background: 'transparent',
      color: 'var(--fg-0)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'var(--bg-2)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'transparent';
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "film-slate",
    size: 16,
    color: "currentColor",
    weight: "fill"
  }), "Works ", /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 13px/1 var(--font-mono)',
      color: 'var(--fg-2)'
    }
  }, st.works))), worksOpen && /*#__PURE__*/React.createElement(CreatorWorksModal, {
    creator: creator,
    films: st.films,
    onClose: () => setWorksOpen(false),
    onCreator: onCreator,
    onOpen: onOpen
  }));
}

// compact follow pill that lives in a card corner
function CornerFollow({
  id
}) {
  const [following, setFollowing] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      setFollowing(f => !f);
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '6px 12px',
      borderRadius: 'var(--radius-pill)',
      cursor: 'pointer',
      font: '600 12px/1 var(--font-body)',
      transition: 'all var(--dur-fast)',
      borderWidth: 1,
      borderStyle: 'solid',
      boxShadow: 'var(--shadow-1)',
      background: following ? 'var(--bg-2)' : hover ? 'var(--coral-bright)' : 'var(--coral)',
      borderColor: following ? 'var(--border-strong)' : 'transparent',
      color: following ? 'var(--fg-0)' : 'var(--fg-on-accent)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: following ? 'check' : 'plus',
    size: 13,
    color: "currentColor",
    weight: "bold"
  }), following ? 'Following' : 'Follow');
}

// modal of a creator's works + a jump to their full page
function CreatorWorksModal({
  creator,
  films,
  onClose,
  onCreator,
  onOpen
}) {
  React.useEffect(() => {
    const h = e => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  const sorted = films.slice().sort((a, b) => b.score - a.score);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: 'rgba(5,5,5,0.74)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)'
    }
  }, /*#__PURE__*/React.createElement("style", null, `@keyframes aicdbWorksIn{from{transform:translateY(14px) scale(0.985)}to{transform:none}}`), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: 620,
      maxHeight: '84vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-1)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-3)',
      overflow: 'hidden',
      animation: 'aicdbWorksIn 0.34s var(--ease-out) both'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '22px 24px 18px',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 46,
      height: 46,
      borderRadius: '50%',
      flex: 'none',
      background: `linear-gradient(135deg, ${creator.av[0]}, ${creator.av[1]})`,
      boxShadow: 'var(--shadow-1)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: '600 20px/1.2 var(--font-display)',
      color: 'var(--fg-0)',
      margin: 0
    }
  }, creator.name), creator.verified && /*#__PURE__*/React.createElement(Seal, {
    size: 15
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)',
      margin: '5px 0 0'
    }
  }, sorted.length, " ", sorted.length === 1 ? 'work' : 'works', " on Dreamwall")), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      display: 'flex',
      padding: 8,
      borderRadius: '50%',
      flex: 'none',
      cursor: 'pointer',
      background: 'var(--bg-2)',
      border: '1px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 15,
    color: "var(--fg-1)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowY: 'auto',
      padding: '14px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, sorted.length ? sorted.map(f => {
    const t = window.AICDB_TYPES[f.type];
    const aspect = f.type === 'vertical' ? '9/16' : '2/3';
    return /*#__PURE__*/React.createElement("div", {
      key: f.id,
      onClick: () => onOpen && onOpen(f),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '10px 12px',
        cursor: 'pointer',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        background: 'var(--bg-0)',
        transition: 'border-color var(--dur-fast)'
      },
      onMouseEnter: e => {
        e.currentTarget.style.borderColor = 'var(--border-default)';
      },
      onMouseLeave: e => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 42,
        flex: 'none',
        aspectRatio: aspect,
        borderRadius: 'var(--radius-sm)',
        overflow: 'hidden',
        background: `linear-gradient(150deg, ${f.g[0]}, ${f.g[1]} 150%)`,
        boxShadow: 'var(--shadow-1)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0,
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 15px/1.2 var(--font-display)',
        color: 'var(--fg-0)'
      }
    }, f.title), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 8.5px/1 var(--font-body)',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        color: t.text,
        background: t.ghost,
        padding: '3px 7px',
        borderRadius: 'var(--radius-pill)'
      }
    }, t.label)), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--text-data-sm)',
        color: 'var(--fg-2)',
        marginTop: 4
      }
    }, f.year, " \xB7 ", f.runtime)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 'none',
        font: '700 17px/1 var(--font-mono)',
        color: scoreColor(f.score)
      }
    }, f.score.toFixed(1)));
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '40px 0',
      textAlign: 'center',
      font: 'var(--text-body)',
      color: 'var(--fg-2)'
    }
  }, "No works published yet.")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 20px',
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--bg-0)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: 'creator.html?name=' + encodeURIComponent(creator.name),
    onClick: e => {
      if (onCreator) {
        e.preventDefault();
        onClose();
        onCreator(creator.name);
      }
    },
    style: {
      width: '100%',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: '12px 0',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      textDecoration: 'none',
      font: '600 14px/1 var(--font-body)',
      background: 'var(--coral)',
      color: 'var(--fg-on-accent)',
      transition: 'background var(--dur-fast)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'var(--coral-bright)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'var(--coral)';
    }
  }, "Go to creator\u2019s page ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 15,
    color: "currentColor"
  })))));
}

// full-width follow button used in cards
function FullWidthFollow({
  id
}) {
  const [following, setFollowing] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => setFollowing(f => !f),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: '100%',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: '11px 0',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      font: '600 14px/1 var(--font-body)',
      transition: 'all var(--dur-fast)',
      borderWidth: 1,
      borderStyle: 'solid',
      background: following ? 'transparent' : hover ? 'var(--coral-bright)' : 'var(--coral)',
      borderColor: following ? 'var(--border-strong)' : 'transparent',
      color: following ? 'var(--fg-0)' : 'var(--fg-on-accent)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: following ? 'check' : 'plus',
    size: 16,
    color: "currentColor"
  }), following ? 'Following' : 'Follow');
}
function CreatorsPage({
  onCreator,
  onOpen
}) {
  const all = window.AICDB_CREATORS;
  const featured = all.slice().sort((a, b) => b.followers - a.followers)[0];
  const rest = all.filter(c => c.id !== featured.id);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: '0 auto',
      padding: '28px 28px 90px'
    }
  }, /*#__PURE__*/React.createElement(FeaturedCreator, {
    creator: featured,
    onCreator: onCreator,
    onOpen: onOpen
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--text-h2)',
      color: 'var(--fg-0)',
      letterSpacing: '-0.01em'
    }
  }, "All creators"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)'
    }
  }, all.length, " verified & rising")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
      gap: 22
    }
  }, rest.map(c => /*#__PURE__*/React.createElement(CreatorCard, {
    key: c.id,
    creator: c,
    onCreator: onCreator,
    onOpen: onOpen
  }))));
}
Object.assign(window, {
  CreatorsPage,
  FeaturedCreator,
  CreatorCard,
  MiniStat,
  FullWidthFollow,
  CornerFollow,
  CreatorWorksModal
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/CreatorsPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/DetailParts.jsx
try { (() => {
// Dreamwall UI kit — detail-page building blocks
// DualScore, WatchlistSplit, ShareButton, ExtraordinaryMeter,
// CreditsSection, StatsSection, ProductionSection, AddReviewBox.

// ---- aggregate score + personal score, side by side, different colors ----
function DualScore({
  film,
  userScore
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'stretch',
      gap: 0,
      background: 'var(--bg-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: '18px 24px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      color: 'var(--fg-2)',
      marginBottom: 8
    }
  }, "Score"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 44px/1 var(--font-mono)',
      color: scoreColor(film.score),
      letterSpacing: '-0.02em'
    }
  }, film.score.toFixed(1))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      background: 'var(--border-subtle)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: '18px 24px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      color: 'var(--coral-bright)',
      marginBottom: 8
    }
  }, "Your Score"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 44px/1 var(--font-mono)',
      color: userScore ? 'var(--coral)' : 'var(--fg-3)',
      letterSpacing: '-0.02em'
    }
  }, userScore ? userScore.toFixed(1) : '—')));
}

// ---- Joined watchlist button: main toggle + grey "+" dropdown ----
function WatchlistSplit({
  film
}) {
  const ids = useWatchlist();
  const inList = ids.includes(film.id);
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  const [lists, setLists] = React.useState({
    'Favorites': false,
    'Watch Later': false,
    'Best of 2025': false
  });
  React.useEffect(() => {
    if (!open) return;
    const close = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  const toggleList = name => setLists(s => ({
    ...s,
    [name]: !s[name]
  }));
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-1)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => window.AICDB_WATCHLIST.toggle(film.id),
    style: {
      flex: 1,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: '12px 14px',
      border: 'none',
      cursor: 'pointer',
      font: '600 14px/1 var(--font-body)',
      background: inList ? 'var(--teal)' : 'var(--teal-ghost)',
      color: inList ? '#04201e' : 'var(--teal-bright)',
      transition: 'background var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: inList ? 'check' : 'plus',
    size: 16,
    color: inList ? '#04201e' : 'var(--teal-bright)'
  }), inList ? 'On your watchlist' : 'Add to watchlist'), /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(o => !o),
    title: "Add to a list",
    style: {
      width: '20%',
      minWidth: 48,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      borderLeft: '1px solid rgba(0,0,0,0.35)',
      cursor: 'pointer',
      background: 'var(--bg-3)',
      color: 'var(--fg-0)',
      transition: 'background var(--dur-fast)'
    },
    onMouseEnter: e => e.currentTarget.style.background = '#33322f',
    onMouseLeave: e => e.currentTarget.style.background = 'var(--bg-3)'
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16,
    color: "var(--fg-0)",
    weight: "bold"
  }))), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 'calc(100% + 8px)',
      left: 0,
      right: 0,
      zIndex: 70,
      padding: 6,
      background: 'var(--bg-1)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      padding: '6px 10px 8px',
      color: 'var(--fg-2)'
    }
  }, "Add to list"), /*#__PURE__*/React.createElement(ListRow, {
    name: "Watchlist",
    checked: inList,
    onClick: () => window.AICDB_WATCHLIST.toggle(film.id)
  }), Object.keys(lists).map(n => /*#__PURE__*/React.createElement(ListRow, {
    key: n,
    name: n,
    checked: lists[n],
    onClick: () => toggleList(n)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'var(--border-subtle)',
      margin: '6px 4px'
    }
  }), /*#__PURE__*/React.createElement(ListRow, {
    name: "Create new list\u2026",
    plus: true,
    onClick: () => {}
  })));
}
function ListRow({
  name,
  checked,
  onClick,
  plus
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '9px 10px',
      cursor: 'pointer',
      borderRadius: 'var(--radius-md)',
      background: hover ? 'var(--bg-2)' : 'transparent',
      font: '500 13.5px/1 var(--font-body)',
      color: plus ? 'var(--teal-bright)' : 'var(--fg-0)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: plus ? 'plus' : checked ? 'check' : 'bookmark',
    size: 15,
    color: plus ? 'var(--teal-bright)' : checked ? 'var(--teal)' : 'var(--fg-2)',
    fill: checked && !plus ? 'var(--teal)' : 'none'
  }), name);
}

// ---- Share button — copies the page link ----
function ShareButton() {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    const url = window.location.href;
    const done = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(done);
    } else {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch (e) {}
      document.body.removeChild(ta);
      done();
    }
  };
  return /*#__PURE__*/React.createElement("button", {
    onClick: copy,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      width: '100%',
      padding: '11px 16px',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      background: 'transparent',
      border: '1px solid ' + (copied ? 'var(--border-accent)' : 'var(--border-strong)'),
      color: copied ? 'var(--coral-bright)' : 'var(--fg-0)',
      font: '600 14px/1 var(--font-body)',
      transition: 'all var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: copied ? 'check' : 'share-2',
    size: 16,
    color: copied ? 'var(--coral-bright)' : 'currentColor'
  }), copied ? 'Link copied!' : 'Share');
}

// ---- Ordinary ⟷ Extraordinary (Sıradışılık / uniqueness) meter ----
// The arc shows the community uniqueness level. The signed-in user's own pick is
// drawn as a small blue inverted triangle sitting on top of the arc. Submitting a
// score happens through a small popup opened from the button by the heading.
// Power-user feature: only visible to viewers who've logged 1000+ titles.
function ExtraordinaryMeter({
  film
}) {
  const community = (window.AICDB_DETAILS[film.id] || {}).extraordinary || 60;
  const minLogged = window.AICDB_UNIQUENESS_MIN_LOGGED || 1000;
  const logged = (window.AICDB_VIEWER || {}).loggedTitles || 0;
  const eligible = logged >= minLogged;
  const [user, setUser] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState(community);

  // hooks must run unconditionally — bail out after them
  if (!eligible) return null;
  const BLUE = 'var(--info)';
  const BLUE_GHOST = 'rgba(111,156,235,0.16)';

  // geometry (viewBox 220 x 132)
  const CX = 110,
    CY = 112,
    R = 86;
  const pointForPct = p => {
    const theta = (1 - p / 100) * Math.PI; // 0% → π (left), 100% → 0 (right)
    return {
      x: CX + R * Math.cos(theta),
      y: CY - R * Math.sin(theta)
    };
  };
  const arcTo = p => {
    const {
      x,
      y
    } = pointForPct(p);
    return `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${x} ${y}`;
  };

  // small blue inverted triangle anchored just outside the arc, pointing in at the arc
  const triFor = p => {
    const theta = (1 - p / 100) * Math.PI;
    const rr = R + 15;
    const ax = CX + rr * Math.cos(theta);
    const ay = CY - rr * Math.sin(theta);
    const rot = Math.atan2(CY - ay, CX - ax) * 180 / Math.PI - 90;
    return {
      ax,
      ay,
      rot
    };
  };
  const openPopup = () => {
    setDraft(user != null ? user : community);
    setOpen(true);
  };
  const submit = () => {
    setUser(draft);
    setOpen(false);
  };
  const tri = user != null ? triFor(user) : null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      padding: '18px 20px 16px',
      background: 'var(--bg-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      font: '600 15px/1.2 var(--font-display)',
      color: 'var(--fg-0)',
      margin: 0
    }
  }, "How unconventional?"), /*#__PURE__*/React.createElement("button", {
    onClick: openPopup,
    title: "Rate uniqueness",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 11px',
      cursor: 'pointer',
      borderRadius: 'var(--radius-pill)',
      border: '1px solid ' + (open ? BLUE : 'rgba(111,156,235,0.4)'),
      background: open ? BLUE : BLUE_GHOST,
      color: open ? '#0b1426' : BLUE,
      font: '600 12px/1 var(--font-body)',
      transition: 'all var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: user != null ? 'pencil-simple' : 'plus',
    size: 12,
    color: open ? '#0b1426' : BLUE,
    weight: "bold"
  }), user != null ? 'Edit' : 'Rate')), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 220 132",
    width: "100%",
    style: {
      display: 'block',
      overflow: 'visible'
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: `gauge-${film.id}`,
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "0"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "var(--bg-3)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "55%",
    stopColor: "var(--coral-dim)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "var(--coral)"
  }))), /*#__PURE__*/React.createElement("path", {
    d: arcTo(100),
    fill: "none",
    stroke: "var(--bg-3)",
    strokeWidth: "12",
    strokeLinecap: "round"
  }), Array.from({
    length: 11
  }).map((_, i) => {
    const a = (1 - i / 10) * Math.PI;
    const x1 = CX + (R - 9) * Math.cos(a),
      y1 = CY - (R - 9) * Math.sin(a);
    const x2 = CX + (R - 3) * Math.cos(a),
      y2 = CY - (R - 3) * Math.sin(a);
    return /*#__PURE__*/React.createElement("line", {
      key: i,
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
      stroke: "var(--bg-0)",
      strokeWidth: i % 5 === 0 ? 2 : 1.2,
      opacity: "0.8"
    });
  }), /*#__PURE__*/React.createElement("path", {
    d: arcTo(community),
    fill: "none",
    stroke: `url(#gauge-${film.id})`,
    strokeWidth: "12",
    strokeLinecap: "round"
  }), tri && /*#__PURE__*/React.createElement("polygon", {
    points: "0,8 -6.5,-4 6.5,-4",
    fill: BLUE,
    stroke: "var(--bg-1)",
    strokeWidth: "1.5",
    transform: `translate(${tri.ax} ${tri.ay}) rotate(${tri.rot})`
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginTop: -4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 30px/1 var(--font-mono)',
      color: 'var(--coral)'
    }
  }, community), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 14px/1 var(--font-mono)',
      color: 'var(--fg-2)'
    }
  }, "%"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-3)',
      marginTop: 4
    }
  }, "Community level"), user != null && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      marginTop: 8,
      padding: '4px 10px',
      borderRadius: 'var(--radius-pill)',
      background: BLUE_GHOST,
      border: '1px solid rgba(111,156,235,0.35)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 0,
      height: 0,
      borderLeft: '5px solid transparent',
      borderRight: '5px solid transparent',
      borderTop: `7px solid ${BLUE}`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 12px/1 var(--font-body)',
      color: BLUE
    }
  }, "Your take \xB7 ", user, "%"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "overline",
    style: {
      color: 'var(--fg-2)'
    }
  }, "Ordinary"), /*#__PURE__*/React.createElement("span", {
    className: "overline",
    style: {
      color: 'var(--coral-bright)'
    }
  }, "Extraordinary")), open && /*#__PURE__*/React.createElement(UniquenessPopup, {
    draft: draft,
    setDraft: setDraft,
    onSubmit: submit,
    onClose: () => setOpen(false),
    hasPrev: user != null,
    blue: BLUE
  }));
}

// small popup anchored to the meter card for submitting a uniqueness score
function UniquenessPopup({
  draft,
  setDraft,
  onSubmit,
  onClose,
  hasPrev,
  blue
}) {
  React.useEffect(() => {
    const h = e => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 40
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 54,
      right: 14,
      zIndex: 41,
      width: 236,
      padding: '16px 16px 14px',
      background: 'var(--bg-2)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-3)',
      animation: 'aicdbUniqPop 0.18s var(--ease-out) both'
    }
  }, /*#__PURE__*/React.createElement("style", null, `@keyframes aicdbUniqPop{from{transform:translateY(-6px)}to{transform:none}}`), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 13px/1.2 var(--font-body)',
      color: 'var(--fg-0)',
      marginBottom: 3
    }
  }, "Your uniqueness score"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)',
      marginBottom: 14
    }
  }, "How unconventional is this title?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'center',
      gap: 2,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 32px/1 var(--font-mono)',
      color: blue
    }
  }, draft), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 15px/1 var(--font-mono)',
      color: 'var(--fg-2)'
    }
  }, "%")), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "0",
    max: "100",
    value: draft,
    onChange: e => setDraft(Number(e.target.value)),
    style: {
      width: '100%',
      accentColor: blue,
      cursor: 'pointer'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "overline",
    style: {
      color: 'var(--fg-3)'
    }
  }, "Ordinary"), /*#__PURE__*/React.createElement("span", {
    className: "overline",
    style: {
      color: 'var(--fg-3)'
    }
  }, "Extraordinary")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      flex: 'none',
      padding: '9px 13px',
      cursor: 'pointer',
      borderRadius: 'var(--radius-md)',
      background: 'transparent',
      border: '1px solid var(--border-default)',
      color: 'var(--fg-1)',
      font: '600 13px/1 var(--font-body)'
    }
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    onClick: onSubmit,
    style: {
      flex: 1,
      padding: '9px 13px',
      cursor: 'pointer',
      borderRadius: 'var(--radius-md)',
      background: blue,
      border: '1px solid transparent',
      color: '#0b1426',
      font: '600 13px/1 var(--font-body)'
    }
  }, hasPrev ? 'Update score' : 'Submit score'))));
}

// ---- Credits / crew ----
function CreditItem({
  role,
  name
}) {
  const initials = name.replace('@', '').split(/[\s.]+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      flex: 'none',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-3)',
      border: '1px solid var(--border-subtle)',
      font: '600 14px/1 var(--font-body)',
      color: 'var(--fg-1)'
    }
  }, initials), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      color: 'var(--fg-2)',
      marginBottom: 3
    }
  }, role), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 14px/1.2 var(--font-body)',
      color: 'var(--fg-0)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, name)));
}
function CreditsSection({
  film
}) {
  const crew = (window.AICDB_DETAILS[film.id] || {}).crew || [];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 48
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--text-h2)',
      color: 'var(--fg-0)',
      marginBottom: 20
    }
  }, "Credits"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
      gap: 20
    }
  }, crew.map(([role, name]) => /*#__PURE__*/React.createElement(CreditItem, {
    key: role,
    role: role,
    name: name
  }))));
}

// ---- Statistics ----
function StatBlock({
  icon,
  color,
  value,
  label
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 20px',
      background: 'var(--bg-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 18,
    color: color,
    weight: "fill"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 26px/1 var(--font-mono)',
      color: 'var(--fg-0)',
      letterSpacing: '-0.02em',
      margin: '12px 0 6px'
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      color: 'var(--fg-2)'
    }
  }, label));
}
function StatsSection({
  film
}) {
  const s = window.AICDB_STAT(film);
  return /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 48
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--text-h2)',
      color: 'var(--fg-0)',
      marginBottom: 20
    }
  }, "Statistics"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(StatBlock, {
    icon: "eye",
    color: "var(--teal)",
    value: fmtCount(s.watched),
    label: "Watched"
  }), /*#__PURE__*/React.createElement(StatBlock, {
    icon: "heart",
    color: "var(--coral)",
    value: fmtCount(s.favorited),
    label: "Favorited"
  }), /*#__PURE__*/React.createElement(StatBlock, {
    icon: "bookmark",
    color: "var(--type-vertical)",
    value: fmtCount(s.watchlisted),
    label: "Watchlisted"
  }), /*#__PURE__*/React.createElement(StatBlock, {
    icon: "star",
    color: "var(--warning)",
    value: fmtCount(s.rated),
    label: "Ratings"
  }), /*#__PURE__*/React.createElement(StatBlock, {
    icon: "gauge",
    color: "var(--teal-bright)",
    value: Math.round(s.completion * 100) + '%',
    label: "Avg completion"
  })));
}

// ---- Production info ----
function SpecRow({
  label,
  children,
  last
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 20,
      padding: '14px 0',
      borderBottom: last ? 'none' : '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      color: 'var(--fg-2)',
      width: 150,
      flex: 'none',
      paddingTop: 3
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      font: 'var(--text-body)',
      color: 'var(--fg-0)'
    }
  }, children));
}
function ProductionSection({
  film
}) {
  const d = window.AICDB_DETAILS[film.id] || {};
  return /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 48
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--text-h2)',
      color: 'var(--fg-0)',
      marginBottom: 8
    }
  }, "Production"), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '6px 22px',
      background: 'var(--bg-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement(SpecRow, {
    label: "AI Models"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8
    }
  }, (d.models || []).map(m => /*#__PURE__*/React.createElement("span", {
    key: m,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '5px 11px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--teal-ghost)',
      color: 'var(--teal-bright)',
      font: '600 12px/1 var(--font-mono)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 12,
    color: "var(--teal-bright)"
  }), m)))), /*#__PURE__*/React.createElement(SpecRow, {
    label: "Technique"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-1)'
    }
  }, film.technique)), /*#__PURE__*/React.createElement(SpecRow, {
    label: "Budget"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 var(--font-mono)'
    }
  }, d.budget || '—')), /*#__PURE__*/React.createElement(SpecRow, {
    label: "Production time"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-1)'
    }
  }, d.duration || '—')), /*#__PURE__*/React.createElement(SpecRow, {
    label: "Contributors",
    last: true
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-1)'
    }
  }, d.contributors || '—', " people & pipelines"))));
}

// ---- Inline add-review composer (text only — rating is done separately) ----
function AddReviewBox({
  onPost,
  onCancel
}) {
  const [body, setBody] = React.useState('');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 20px',
      background: 'var(--bg-1)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 14px/1 var(--font-body)',
      color: 'var(--fg-0)'
    }
  }, "Your review"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-3)'
    }
  }, "\xB7 rate this title separately to give it a score")), /*#__PURE__*/React.createElement("textarea", {
    value: body,
    onChange: e => setBody(e.target.value),
    placeholder: "What did you make of it?",
    style: {
      width: '100%',
      minHeight: 84,
      resize: 'vertical',
      background: 'var(--bg-0)',
      color: 'var(--fg-0)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: '12px 14px',
      font: 'var(--text-body)',
      outline: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: onCancel
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "check",
    onClick: () => {
      if (body.trim()) onPost({
        user: 'You',
        av: ['#d85a30', '#9d8df1'],
        when: 'just now',
        likes: 0,
        body: body.trim()
      });
    }
  }, "Post review")));
}
Object.assign(window, {
  DualScore,
  WatchlistSplit,
  ShareButton,
  ExtraordinaryMeter,
  UniquenessPopup,
  CreditsSection,
  StatsSection,
  ProductionSection,
  AddReviewBox
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/DetailParts.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/Discover.jsx
try { (() => {
// Dreamwall UI kit — Discover / home screen
function Hero({
  film,
  onOpen
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      marginBottom: 44,
      minHeight: 340,
      background: 'var(--bg-inset)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      width: '64%',
      background: `linear-gradient(120deg, ${film.g[0]}, ${film.g[1]} 160%)`,
      WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 46%, rgba(0,0,0,0) 100%)',
      maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 46%, rgba(0,0,0,0) 100%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(90deg, rgba(5,5,5,0.35) 0%, rgba(5,5,5,0.55) 46%, var(--bg-inset) 78%),' + 'linear-gradient(to top, var(--bg-inset) 2%, transparent 32%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      opacity: 0.4,
      backgroundImage: 'radial-gradient(rgba(245,243,239,0.05) 1px, transparent 1px)',
      backgroundSize: '5px 5px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      padding: '44px 48px',
      maxWidth: 540,
      marginLeft: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "overline",
    style: {
      color: 'var(--coral-bright)'
    }
  }, "Featured this week"), /*#__PURE__*/React.createElement(ContentBadge, {
    type: film.type
  }), /*#__PURE__*/React.createElement(ContentRibbon, {
    film: film,
    size: "sm"
  })), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--text-display)',
      letterSpacing: '-0.015em',
      color: 'var(--fg-0)',
      marginBottom: 14
    }
  }, film.title), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-lg)',
      color: 'var(--fg-1)',
      marginBottom: 22,
      maxWidth: 460
    }
  }, film.synopsis), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      marginBottom: 26
    }
  }, /*#__PURE__*/React.createElement(ScoreLine, {
    film: film,
    size: 28,
    countColor: "var(--fg-2)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-data)',
      color: 'var(--fg-1)'
    }
  }, film.year, " \xB7 ", film.runtime)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "play",
    onClick: () => onOpen(film)
  }, "View title"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    icon: "plus"
  }, "Watchlist"))));
}
function Discover({
  onOpen
}) {
  const films = window.AICDB_FILMS;
  const byScore = [...films].sort((a, b) => b.score - a.score);
  const byStars = [...films].sort((a, b) => b.stars - a.stars);
  const byYear = [...films].sort((a, b) => b.year - a.year);
  const ratingNum = f => parseFloat(String(f.ratings).replace('k', '')) * (String(f.ratings).includes('k') ? 1000 : 1);
  const byBuzz = [...films].sort((a, b) => ratingNum(b) - ratingNum(a));
  const series = films.filter(f => f.type === 'series');
  const shorts = films.filter(f => f.type === 'short' || f.type === 'vertical');
  const random = [...films].sort(() => Math.random() - 0.5);
  const sections = [{
    title: 'Recommended',
    sub: 'Based on your ratings',
    films: dedupe([...byStars]).slice(0, 6)
  }, {
    title: 'Top Rated',
    films: byScore.slice(0, 6)
  }, {
    title: 'Trending Recently',
    films: byBuzz.slice(0, 6)
  }, {
    title: 'New',
    films: byYear.slice(0, 6)
  }, {
    title: 'Serial Lover',
    sub: 'For the binge-watchers',
    films: series
  }, {
    title: 'Shorts',
    films: shorts
  }, {
    title: 'Random',
    sub: 'Roll the dice',
    films: random.slice(0, 6)
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: '0 auto',
      padding: '32px 28px 80px'
    }
  }, /*#__PURE__*/React.createElement(Hero, {
    film: films[1],
    onOpen: onOpen
  }), sections.map(s => /*#__PURE__*/React.createElement(FilmRow, {
    key: s.title,
    title: s.title,
    sub: s.sub,
    films: s.films,
    onOpen: onOpen
  })));
}
function dedupe(list) {
  const seen = new Set();
  return list.filter(f => seen.has(f.id) ? false : seen.add(f.id));
}
Object.assign(window, {
  Discover,
  Hero
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/Discover.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/Extras.jsx
try { (() => {
// Dreamwall UI kit — shared "system" surfaces:
// EmptyState, loading Skeletons, MoreLikeThis, SearchEmpty (no-results),
// NotFound (404), Footer + LanguageSelector.

// ============================================================
// Empty state — icon + headline + sub + action button
// ============================================================
function EmptyState({
  icon,
  title,
  sub,
  actionLabel,
  onAction,
  accent = 'var(--coral)',
  compact
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      padding: compact ? '48px 24px' : '80px 24px',
      maxWidth: 440,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 88,
      height: 88,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-1)',
      border: '1px solid var(--border-subtle)',
      marginBottom: 24,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: '50%',
      background: `radial-gradient(circle at 50% 35%, ${accent}22, transparent 70%)`
    }
  }), /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 36,
    color: accent,
    weight: "fill"
  })), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: '600 24px/1.2 var(--font-display)',
      color: 'var(--fg-0)',
      margin: '0 0 10px'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body)',
      color: 'var(--fg-2)',
      margin: '0 0 24px',
      maxWidth: 360
    }
  }, sub), actionLabel && /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: onAction
  }, actionLabel));
}

// ============================================================
// Loading skeletons — poster-shaped grey placeholders, gentle shimmer
// ============================================================
const SKELETON_STYLE = `
@keyframes aicdbShimmer { 0% { background-position: -360px 0; } 100% { background-position: 360px 0; } }
.aicdb-skel { background: linear-gradient(100deg, var(--bg-1) 30%, var(--bg-2) 50%, var(--bg-1) 70%);
  background-size: 720px 100%; animation: aicdbShimmer 1.25s linear infinite; }
@media (prefers-reduced-motion: reduce) { .aicdb-skel { animation: none; } }
`;
function SkeletonCard({
  vertical
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "aicdb-skel",
    style: {
      aspectRatio: vertical ? '9/16' : '2/3',
      borderRadius: 'var(--radius-lg)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "aicdb-skel",
    style: {
      height: 13,
      width: '78%',
      borderRadius: 6,
      marginTop: 12
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "aicdb-skel",
    style: {
      height: 11,
      width: '46%',
      borderRadius: 6,
      marginTop: 8
    }
  }));
}
function SkeletonGrid({
  count = 12,
  min = 176
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`,
      gap: 24
    }
  }, Array.from({
    length: count
  }).map((_, i) => /*#__PURE__*/React.createElement(SkeletonCard, {
    key: i
  })));
}

// ============================================================
// More like this — similar posters at the bottom of a detail page
// ============================================================
function MoreLikeThis({
  film,
  onOpen
}) {
  const similar = window.AICDB_SIMILAR(film, 6);
  if (!similar.length) return null;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 48
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--text-h2)',
      color: 'var(--fg-0)',
      marginBottom: 20
    }
  }, "More like this"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: 20
    }
  }, similar.map(f => /*#__PURE__*/React.createElement(FilmCard, {
    key: f.id,
    film: f,
    width: "auto",
    onOpen: onOpen || (() => {})
  }))));
}

// ============================================================
// Search empty / Content not found — dark editorial empty state
// ============================================================
function SearchEmpty({
  query,
  suggestion,
  onBrowse,
  onSuggest
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: '0 auto',
      padding: '60px 28px 90px'
    }
  }, /*#__PURE__*/React.createElement(EmptyState, {
    icon: "magnifying-glass",
    accent: "var(--teal)",
    title: query ? `No results for “${query}”` : 'No results found',
    sub: "We couldn\u2019t find any titles matching that. Check the spelling, try different keywords, or browse the catalog."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      justifyContent: 'center',
      marginTop: -8,
      flexWrap: 'wrap'
    }
  }, suggestion && suggestion.toLowerCase() !== (query || '').toLowerCase() && /*#__PURE__*/React.createElement("button", {
    onClick: () => onSuggest && onSuggest(suggestion),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '11px 18px',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      font: '600 14px/1 var(--font-body)',
      background: 'var(--teal-ghost)',
      border: '1px solid rgba(78,205,196,0.4)',
      color: 'var(--teal-bright)'
    }
  }, "Did you mean ", /*#__PURE__*/React.createElement("span", {
    style: {
      textDecoration: 'underline'
    }
  }, suggestion), "?"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    icon: "compass",
    onClick: onBrowse
  }, "Browse the catalog")));
}

// ============================================================
// 404 — cinematic "this frame doesn't exist yet"
// ============================================================
function NotFound({
  onHome
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '40px 24px',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      background: 'radial-gradient(110% 80% at 20% 8%, rgba(216,90,48,0.16), transparent 46%),' + 'radial-gradient(100% 80% at 84% 94%, rgba(78,205,196,0.12), transparent 48%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      opacity: 0.5,
      backgroundImage: 'radial-gradient(rgba(245,243,239,0.04) 1px, transparent 1px)',
      backgroundSize: '5px 5px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      marginBottom: 34
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 172,
      height: 116,
      borderRadius: 'var(--radius-md)',
      border: '2px dashed var(--border-strong)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, rgba(216,90,48,0.06), rgba(78,205,196,0.05))'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 14,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',
      borderRight: '1px solid var(--border-subtle)'
    }
  }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 6,
      height: 6,
      borderRadius: 1.5,
      background: 'var(--bg-3)'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: 14,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',
      borderLeft: '1px solid var(--border-subtle)'
    }
  }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 6,
      height: 6,
      borderRadius: 1.5,
      background: 'var(--bg-3)'
    }
  }))), /*#__PURE__*/React.createElement(Icon, {
    name: "film-slate",
    size: 40,
    color: "var(--fg-3)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 14px/1 var(--font-mono)',
      color: 'var(--coral-bright)',
      letterSpacing: '0.18em',
      marginBottom: 18
    }
  }, "ERROR 404"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: '700 clamp(36px, 6vw, 60px)/1.05 var(--font-display)',
      letterSpacing: '-0.02em',
      color: 'var(--fg-0)',
      margin: '0 auto 18px',
      maxWidth: 640
    }
  }, "This frame doesn\u2019t exist yet."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-lg)',
      color: 'var(--fg-2)',
      margin: '0 auto 32px',
      maxWidth: 440
    }
  }, "The title you\u2019re looking for was never rendered \u2014 or it drifted off into latent space. Let\u2019s get you back to something real."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      justifyContent: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "house",
    onClick: onHome
  }, "Back to homepage"))));
}

// ============================================================
// Language selector — EN default (groundwork)
// ============================================================
function LanguageSelector({
  compact
}) {
  const [open, setOpen] = React.useState(false);
  const [lang, setLang] = React.useState('EN');
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const close = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(o => !o),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 13px',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      background: 'var(--bg-1)',
      border: '1px solid var(--border-default)',
      color: 'var(--fg-1)',
      font: '600 13px/1 var(--font-body)',
      transition: 'border-color var(--dur-fast)'
    },
    onMouseEnter: e => e.currentTarget.style.borderColor = 'var(--border-strong)',
    onMouseLeave: e => e.currentTarget.style.borderColor = 'var(--border-default)'
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "globe",
    size: 15,
    color: "var(--fg-2)"
  }), lang, /*#__PURE__*/React.createElement(Icon, {
    name: open ? 'caret-up' : 'caret-down',
    size: 11,
    color: "var(--fg-3)"
  })), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 'calc(100% + 8px)',
      left: 0,
      zIndex: 60,
      minWidth: 200,
      maxHeight: 320,
      overflowY: 'auto',
      padding: 6,
      background: 'var(--bg-1)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-3)'
    }
  }, (window.AICDB_LANGUAGES || []).map(l => {
    const on = l.code === lang;
    return /*#__PURE__*/React.createElement("div", {
      key: l.code,
      onClick: () => {
        setLang(l.code);
        setOpen(false);
      },
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        padding: '9px 11px',
        cursor: 'pointer',
        borderRadius: 'var(--radius-md)',
        font: '500 13.5px/1 var(--font-body)',
        color: on ? 'var(--fg-0)' : 'var(--fg-1)',
        background: on ? 'var(--bg-2)' : 'transparent'
      },
      onMouseEnter: e => {
        if (!on) e.currentTarget.style.background = 'var(--bg-2)';
      },
      onMouseLeave: e => {
        if (!on) e.currentTarget.style.background = 'transparent';
      }
    }, /*#__PURE__*/React.createElement("span", null, l.name, " ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--fg-3)',
        font: '500 12px/1 var(--font-mono)'
      }
    }, l.code)), on && /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 14,
      color: "var(--teal-bright)"
    }));
  })));
}

// ============================================================
// Footer — minimal: language selector + About / Guidelines / Contact
// ============================================================
function Footer({
  onNav
}) {
  const links = ['About', 'Content Guidelines', 'Contact', 'Admin Panel'];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: '1px solid var(--border-subtle)',
      marginTop: 40,
      padding: '34px 28px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 24,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 22,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    size: 16,
    onClick: () => onNav && onNav('Feed')
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 20,
      flexWrap: 'wrap'
    }
  }, links.map(l => {
    const admin = l === 'Admin Panel';
    return /*#__PURE__*/React.createElement("a", {
      key: l,
      href: admin ? 'admin.html' : '#',
      onClick: e => {
        if (!admin) e.preventDefault();
      },
      style: {
        font: '500 13px/1 var(--font-body)',
        color: 'var(--fg-2)',
        cursor: 'pointer'
      },
      onMouseEnter: e => e.currentTarget.style.color = 'var(--fg-0)',
      onMouseLeave: e => e.currentTarget.style.color = 'var(--fg-2)'
    }, l);
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--fg-3)'
    }
  }, "\xA9 2025 Dreamwall"))));
}

// simple Levenshtein for "did you mean" suggestions
function aicdbEditDistance(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  const m = a.length,
    n = b.length;
  const dp = Array.from({
    length: m + 1
  }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[m][n];
}

// best fuzzy title/creator suggestion for a query (or null)
function aicdbSuggest(query) {
  const q = (query || '').trim().toLowerCase();
  if (q.length < 2) return null;
  const cands = [];
  window.AICDB_FILMS.forEach(f => {
    cands.push(f.title);
    cands.push(f.creator);
  });
  let best = null,
    bestD = Infinity;
  cands.forEach(c => {
    const words = c.toLowerCase().split(/\s+/);
    const d = Math.min(aicdbEditDistance(q, c), ...words.map(w => aicdbEditDistance(q, w)));
    if (d < bestD) {
      bestD = d;
      best = c;
    }
  });
  // only suggest if reasonably close
  return bestD > 0 && bestD <= Math.max(2, Math.floor(q.length * 0.45)) ? best : null;
}

// ============================================================
// Email confirmation — "Check your inbox" after signup
// ============================================================
function EmailConfirm({
  email = 'you@example.com',
  onHome
}) {
  const [resent, setResent] = React.useState(false);
  const [seconds, setSeconds] = React.useState(0);
  React.useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);
  const resend = () => {
    if (seconds > 0) return;
    setResent(true);
    setSeconds(30);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '40px 24px',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      background: 'radial-gradient(100% 70% at 50% 0%, rgba(78,205,196,0.12), transparent 52%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      width: '100%',
      maxWidth: 420
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 96,
      height: 96,
      margin: '0 auto 30px',
      borderRadius: '50%',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-1)',
      border: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: '50%',
      background: 'radial-gradient(circle at 50% 35%, rgba(78,205,196,0.2), transparent 70%)'
    }
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "envelope-simple-open",
    size: 42,
    color: "var(--teal-bright)",
    weight: "fill"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 14,
      right: 18,
      width: 14,
      height: 14,
      borderRadius: '50%',
      background: 'var(--coral)',
      border: '2px solid var(--bg-0)'
    }
  })), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: '700 32px/1.1 var(--font-display)',
      letterSpacing: '-0.015em',
      color: 'var(--fg-0)',
      margin: '0 0 14px'
    }
  }, "Check your inbox"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-lg)',
      color: 'var(--fg-2)',
      margin: '0 0 6px'
    }
  }, "We sent a confirmation link to"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: '600 16px/1.4 var(--font-body)',
      color: 'var(--fg-0)',
      margin: '0 0 28px'
    }
  }, email), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body)',
      color: 'var(--fg-2)',
      margin: '0 0 28px',
      maxWidth: 360,
      marginInline: 'auto'
    }
  }, "Click the link in that email to verify your account and start rating. It may take a minute to arrive \u2014 check spam, just in case."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "envelope",
    onClick: () => {}
  }, "Open email app"), /*#__PURE__*/React.createElement("button", {
    onClick: resend,
    disabled: seconds > 0,
    style: {
      background: 'none',
      border: 'none',
      cursor: seconds > 0 ? 'default' : 'pointer',
      font: '500 14px/1 var(--font-body)',
      color: seconds > 0 ? 'var(--fg-3)' : 'var(--teal-bright)'
    }
  }, seconds > 0 ? `Resend code in ${seconds}s` : resent ? 'Code sent again — resend' : 'Didn’t get it? Resend code')), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 34,
      paddingTop: 22,
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: onHome,
    style: {
      cursor: 'pointer',
      font: '500 13px/1 var(--font-body)',
      color: 'var(--fg-2)'
    }
  }, "\u2190 Back to homepage"))));
}
Object.assign(window, {
  EmptyState,
  SkeletonCard,
  SkeletonGrid,
  SKELETON_STYLE,
  MoreLikeThis,
  SearchEmpty,
  NotFound,
  LanguageSelector,
  Footer,
  EmailConfirm,
  aicdbSuggest,
  aicdbEditDistance
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/Extras.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/Feed.jsx
try { (() => {
// Dreamwall UI kit — Feed page (the social hub).
// X/Facebook-inspired scrollable post stream from followed creators.
// Dynamic + alive: composer, post cards with embedded content (uploads,
// ratings, lists), interactive like/comment/repost counts, live sidebar.

function creatorById(id) {
  return window.AICDB_CREATORS.find(c => c.id === id);
}

// ---- small verified seal (shared) ----
function Seal({
  size = 15
}) {
  return /*#__PURE__*/React.createElement(Icon, {
    name: "seal-check",
    size: size,
    color: "var(--teal-bright)",
    weight: "fill"
  });
}

// ---- compact follow pill (shared with Creators page) ----
function FollowPill({
  id,
  size = 'md'
}) {
  const [following, setFollowing] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const pad = size === 'sm' ? '7px 15px' : '9px 18px';
  const fs = size === 'sm' ? 12.5 : 13.5;
  return /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      setFollowing(f => !f);
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      padding: pad,
      borderRadius: 'var(--radius-pill)',
      cursor: 'pointer',
      font: `600 ${fs}px/1 var(--font-body)`,
      transition: 'all var(--dur-fast)',
      borderWidth: 1,
      borderStyle: 'solid',
      background: following ? 'transparent' : hover ? 'var(--fg-1)' : 'var(--fg-0)',
      borderColor: following ? 'var(--border-strong)' : 'transparent',
      color: following ? 'var(--fg-1)' : 'var(--bg-0)'
    }
  }, following ? 'Following' : 'Follow');
}

// ---- post action button (comment) ----
function PostAction({
  icon,
  count,
  color,
  activeColor,
  onToggle,
  toggled,
  fillWhenOn,
  wide
}) {
  const [hover, setHover] = React.useState(false);
  const on = toggled;
  const c = on ? activeColor : hover ? activeColor : 'var(--fg-2)';
  return /*#__PURE__*/React.createElement("button", {
    onClick: onToggle,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      cursor: 'pointer',
      padding: wide ? '7px 18px' : '6px 10px',
      borderRadius: 'var(--radius-pill)',
      color: c,
      transition: 'all var(--dur-fast)',
      font: '600 13px/1 var(--font-mono)',
      border: '1px solid ' + (on ? 'var(--border-accent)' : hover ? 'var(--border-subtle)' : 'transparent'),
      background: on ? 'var(--teal-ghost)' : hover ? 'var(--bg-2)' : 'transparent'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 17,
    color: c,
    fill: on && fillWhenOn ? 'currentColor' : 'none',
    weight: "bold"
  }), count != null && /*#__PURE__*/React.createElement("span", null, fmtCount(count)));
}

// ---- upvote / downvote group. Only the upvote count is visible (downvotes hidden). ----
function VoteGroup({
  count,
  vote,
  onVote
}) {
  const [hovUp, setHovUp] = React.useState(false);
  const [hovDn, setHovDn] = React.useState(false);
  const up = vote === 1,
    dn = vote === -1;
  const shown = count + (up ? 1 : 0);
  const upColor = up ? 'var(--coral-bright)' : hovUp ? 'var(--coral-bright)' : 'var(--fg-2)';
  const dnColor = dn ? 'var(--fg-0)' : hovDn ? 'var(--fg-0)' : 'var(--fg-2)';
  const cell = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '7px 11px',
    transition: 'color var(--dur-fast)',
    font: '700 13px/1 var(--font-mono)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--bg-2)',
      border: '1px solid ' + (up ? 'var(--border-accent)' : 'var(--border-subtle)'),
      transition: 'border-color var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onVote(up ? 0 : 1),
    onMouseEnter: () => setHovUp(true),
    onMouseLeave: () => setHovUp(false),
    title: "Upvote",
    style: {
      ...cell,
      color: upColor,
      borderRadius: 'var(--radius-pill) 0 0 var(--radius-pill)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-fat-up",
    size: 16,
    color: upColor,
    fill: up ? 'currentColor' : 'none',
    weight: "bold"
  }), /*#__PURE__*/React.createElement("span", null, fmtCount(shown))), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 18,
      background: 'var(--border-subtle)',
      flex: 'none'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => onVote(dn ? 0 : -1),
    onMouseEnter: () => setHovDn(true),
    onMouseLeave: () => setHovDn(false),
    title: "Downvote",
    style: {
      ...cell,
      color: dnColor,
      padding: '7px 12px',
      borderRadius: '0 var(--radius-pill) var(--radius-pill) 0'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-fat-down",
    size: 16,
    color: dnColor,
    fill: dn ? 'currentColor' : 'none',
    weight: "bold"
  })));
}

// ---- share — styled as an active, clickable pill ----
function PostShareButton({
  count
}) {
  const [hover, setHover] = React.useState(false);
  const [done, setDone] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setDone(true);
      setTimeout(() => setDone(false), 1600);
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      cursor: 'pointer',
      padding: '5px 11px',
      borderRadius: 'var(--radius-pill)',
      font: '600 12px/1 var(--font-body)',
      transition: 'all var(--dur-fast)',
      border: '1px solid ' + (done ? 'transparent' : 'rgba(78,205,196,0.4)'),
      background: done ? 'var(--teal)' : hover ? 'rgba(78,205,196,0.22)' : 'var(--teal-ghost)',
      color: done ? '#04201e' : 'var(--teal-bright)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: done ? 'check' : 'share-network',
    size: 14,
    color: "currentColor",
    weight: done ? 'bold' : 'fill'
  }), done ? 'Shared' : 'Share');
}

// ---- embedded: new upload (horizontal poster + meta) ----
function EmbeddedUpload({
  film,
  onOpen
}) {
  const [hover, setHover] = React.useState(false);
  const aspect = film.type === 'vertical' ? '9/16' : '2/3';
  return /*#__PURE__*/React.createElement("div", {
    onClick: e => {
      e.stopPropagation();
      onOpen && onOpen(film);
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      gap: 14,
      padding: 12,
      marginTop: 13,
      cursor: 'pointer',
      background: 'var(--bg-2)',
      borderRadius: 'var(--radius-lg)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: hover ? 'var(--border-default)' : 'var(--border-subtle)',
      transition: 'border-color var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 74,
      flex: 'none',
      aspectRatio: aspect,
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      background: `linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 150%)`,
      boxShadow: 'var(--shadow-1)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      color: 'var(--teal-bright)',
      marginBottom: 8
    }
  }, "New release"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 17px/1.2 var(--font-display)',
      color: 'var(--fg-0)'
    }
  }, film.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginTop: 9
    }
  }, /*#__PURE__*/React.createElement(ContentBadge, {
    type: film.type,
    solid: true,
    size: "sm"
  }), /*#__PURE__*/React.createElement(ScoreLine, {
    film: film,
    size: 15,
    countColor: "var(--fg-2)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)'
    }
  }, film.year))));
}

// ---- embedded: rating given ----
function EmbeddedRating({
  film,
  stars,
  onOpen
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: e => {
      e.stopPropagation();
      onOpen && onOpen(film);
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: 12,
      marginTop: 13,
      cursor: 'pointer',
      background: 'var(--bg-2)',
      borderRadius: 'var(--radius-lg)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: hover ? 'var(--border-default)' : 'var(--border-subtle)',
      transition: 'border-color var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 68,
      flex: 'none',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      background: `linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 150%)`,
      boxShadow: 'var(--shadow-1)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 15px/1.2 var(--font-display)',
      color: 'var(--fg-0)',
      marginBottom: 8
    }
  }, film.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(StarRating, {
    value: stars,
    size: 15
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 13px/1 var(--font-mono)',
      color: 'var(--coral-bright)'
    }
  }, stars.toFixed(1)))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 22px/1 var(--font-mono)',
      color: scoreColor(film.score)
    }
  }, film.score.toFixed(1)), /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      color: 'var(--fg-2)',
      marginTop: 5
    }
  }, "Score")));
}

// ---- embedded: list created (row of mini posters) ----
function EmbeddedList({
  title,
  films,
  onOpen
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 13,
      padding: 14,
      background: 'var(--bg-2)',
      borderRadius: 'var(--radius-lg)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "list",
    size: 15,
    color: "var(--coral-bright)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 14px/1 var(--font-body)',
      color: 'var(--fg-0)'
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)'
    }
  }, "\xB7 ", films.length, " titles")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, films.map(f => /*#__PURE__*/React.createElement("div", {
    key: f.id,
    onClick: e => {
      e.stopPropagation();
      onOpen && onOpen(f);
    },
    title: f.title,
    style: {
      flex: 1,
      aspectRatio: '2/3',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      cursor: 'pointer',
      background: `linear-gradient(150deg, ${f.g[0]}, ${f.g[1]} 150%)`,
      boxShadow: 'var(--shadow-1)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      padding: '14px 6px 5px',
      background: 'linear-gradient(to top, rgba(5,5,5,0.85), transparent)',
      font: '700 11px/1 var(--font-mono)',
      color: scoreColor(f.score),
      textAlign: 'center'
    }
  }, f.score.toFixed(1))))));
}

// ---- expandable comment thread (revealed when the comment button is clicked) ----
const FEED_COMMENTERS = [{
  name: 'Ada Vance',
  handle: '@adavance',
  av: ['#d85a30', '#9d8df1']
}, {
  name: 'Rui Tanaka',
  handle: '@ruit',
  av: ['#4ecdc4', '#6f9ceb']
}, {
  name: 'Sloane Park',
  handle: '@sloane',
  av: ['#e8a13b', '#d85a30']
}, {
  name: 'Devi Anand',
  handle: '@devianand',
  av: ['#9d8df1', '#4ecdc4']
}];
const FEED_COMMENT_TEXT = ['This looks unreal — the lighting in the second act especially.', 'Been waiting for this drop. Queued immediately.', 'Okay the color grade is doing something different here. Love it.', 'How long was the render pipeline on this one?'];
function CommentThread({
  post
}) {
  const seed = post.comments || 3;
  const n = Math.max(2, Math.min(3, seed % 3 + 2));
  const comments = Array.from({
    length: n
  }, (_, i) => ({
    who: FEED_COMMENTERS[(seed + i) % FEED_COMMENTERS.length],
    text: FEED_COMMENT_TEXT[(seed + i) % FEED_COMMENT_TEXT.length],
    time: ['2h', '1h', '34m', '12m'][(seed + i) % 4],
    likes: seed * (i + 2) % 24
  }));
  const [draft, setDraft] = React.useState('');
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 13,
      paddingTop: 14,
      borderTop: '1px solid var(--border-subtle)',
      animation: 'aicdbCommentsIn 0.28s var(--ease-out) both'
    }
  }, /*#__PURE__*/React.createElement("style", null, `@keyframes aicdbCommentsIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}`), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 11,
      alignItems: 'flex-start',
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    size: 32,
    colors: ['#d85a30', '#9d8df1']
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 8,
      background: 'var(--bg-2)',
      border: '1px solid ' + (focus ? 'var(--border-accent)' : 'var(--border-subtle)'),
      borderRadius: 'var(--radius-lg)',
      padding: '8px 8px 8px 14px',
      transition: 'border-color var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: draft,
    onChange: e => setDraft(e.target.value),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    placeholder: "Add a comment\u2026",
    style: {
      flex: 1,
      background: 'none',
      border: 'none',
      outline: 'none',
      color: 'var(--fg-0)',
      font: 'var(--text-body-sm)'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setDraft(''),
    disabled: !draft.trim(),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 30,
      height: 30,
      flex: 'none',
      borderRadius: '50%',
      border: 'none',
      cursor: draft.trim() ? 'pointer' : 'default',
      background: draft.trim() ? 'var(--coral)' : 'var(--bg-3)',
      transition: 'background var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "paper-plane-tilt",
    size: 14,
    color: draft.trim() ? 'var(--fg-on-accent)' : 'var(--fg-3)',
    weight: "fill"
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, comments.map((cm, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 11,
      alignItems: 'flex-start',
      padding: '9px 0'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    size: 32,
    colors: cm.who.av
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-2)',
      borderRadius: 'var(--radius-lg)',
      padding: '9px 13px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 13px/1.2 var(--font-body)',
      color: 'var(--fg-0)'
    }
  }, cm.who.name), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-3)'
    }
  }, cm.who.handle)), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-1)',
      margin: '4px 0 0'
    }
  }, cm.text)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '6px 13px 0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-3)'
    }
  }, cm.time), /*#__PURE__*/React.createElement("button", {
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      font: '600 12px/1 var(--font-body)',
      color: 'var(--fg-2)'
    }
  }, "Like"), /*#__PURE__*/React.createElement("button", {
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      font: '600 12px/1 var(--font-body)',
      color: 'var(--fg-2)'
    }
  }, "Reply"), cm.likes > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      font: 'var(--text-data-sm)',
      color: 'var(--fg-3)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-fat-up",
    size: 12,
    color: "var(--coral-bright)",
    weight: "fill"
  }), cm.likes)))))));
}

// ---- a single post ----
function PostCard({
  post,
  onOpen,
  onCreator
}) {
  const c = creatorById(post.creator);
  const film = post.film ? window.AICDB_FILM_BY_ID[post.film] : null;
  const listFilms = post.listFilms ? post.listFilms.map(id => window.AICDB_FILM_BY_ID[id]).filter(Boolean) : [];
  const mentioned = post.mention ? window.AICDB_FILM_BY_ID[post.mention] : null;
  const [vote, setVote] = React.useState(0);
  const [showComments, setShowComments] = React.useState(false);
  const verb = {
    upload: 'released a new title',
    rating: 'rated a title',
    list: 'created a list',
    text: null
  }[post.kind];
  return /*#__PURE__*/React.createElement("article", {
    style: {
      padding: '20px 22px',
      borderBottom: '1px solid var(--border-subtle)',
      transition: 'background var(--dur-fast)'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,0.012)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => onCreator && onCreator(c.name),
    style: {
      cursor: 'pointer',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    size: 46,
    colors: c.av
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => onCreator && onCreator(c.name),
    style: {
      font: '600 15px/1.2 var(--font-body)',
      color: 'var(--fg-0)',
      cursor: 'pointer'
    }
  }, c.name), c.verified && /*#__PURE__*/React.createElement(Seal, {
    size: 15
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)'
    }
  }, c.handle), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-3)'
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)'
    }
  }, post.time), verb && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      marginLeft: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-3)'
    }
  }, "\xB7"), verb)), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-lg)',
      color: 'var(--fg-0)',
      margin: '9px 0 0',
      whiteSpace: 'pre-line'
    },
    dangerouslySetInnerHTML: {
      __html: post.text
    }
  }), post.kind === 'upload' && film && /*#__PURE__*/React.createElement(EmbeddedUpload, {
    film: film,
    onOpen: onOpen
  }), post.kind === 'rating' && film && /*#__PURE__*/React.createElement(EmbeddedRating, {
    film: film,
    stars: post.stars,
    onOpen: onOpen
  }), post.kind === 'list' && /*#__PURE__*/React.createElement(EmbeddedList, {
    title: post.listTitle,
    films: listFilms,
    onOpen: onOpen
  }), mentioned && /*#__PURE__*/React.createElement(EmbeddedUpload, {
    film: mentioned,
    onOpen: onOpen
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginTop: 13
    }
  }, /*#__PURE__*/React.createElement(VoteGroup, {
    count: post.likes,
    vote: vote,
    onVote: setVote
  }), /*#__PURE__*/React.createElement(PostAction, {
    icon: "message-square",
    count: post.comments,
    activeColor: "var(--teal-bright)",
    wide: true,
    toggled: showComments,
    onToggle: () => setShowComments(s => !s)
  }), /*#__PURE__*/React.createElement(PostShareButton, {
    count: post.reposts
  })), showComments && /*#__PURE__*/React.createElement(CommentThread, {
    post: post
  }))));
}

// ---- composer: identities the signed-in user can post as ----
const POST_AS = [{
  id: 'ada',
  name: 'Ada Vance',
  handle: '@adavance',
  av: ['#d85a30', '#9d8df1'],
  role: 'Personal'
}, {
  id: 'vale',
  name: 'The Vale Collective',
  handle: '@thevale',
  av: ['#4ecdc4', '#6f9ceb'],
  role: 'Creator'
}, {
  id: 'maya',
  name: 'Maya Okonkwo',
  handle: '@mayaokonkwo',
  av: ['#d85a30', '#9d8df1'],
  role: 'Creator'
}];

// identity (creator account) selector at the top of the composer
function IdentitySelect({
  value,
  onChange
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const close = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      position: 'relative',
      display: 'inline-block'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(o => !o),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 9,
      padding: '6px 11px 6px 7px',
      cursor: 'pointer',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--bg-2)',
      border: '1px solid var(--border-subtle)',
      transition: 'border-color var(--dur-fast)'
    },
    onMouseEnter: e => e.currentTarget.style.borderColor = 'var(--border-default)',
    onMouseLeave: e => e.currentTarget.style.borderColor = 'var(--border-subtle)'
  }, /*#__PURE__*/React.createElement(Avatar, {
    size: 24,
    colors: value.av
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 13px/1 var(--font-body)',
      color: 'var(--fg-0)'
    }
  }, value.name), value.role === 'Creator' && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 9px/1 var(--font-body)',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      color: 'var(--coral-bright)',
      background: 'var(--coral-ghost)',
      padding: '3px 6px',
      borderRadius: 'var(--radius-pill)'
    }
  }, "Creator"), /*#__PURE__*/React.createElement(Icon, {
    name: open ? 'caret-up' : 'caret-down',
    size: 11,
    color: "var(--fg-3)"
  })), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 'calc(100% + 6px)',
      left: 0,
      zIndex: 40,
      minWidth: 236,
      padding: 6,
      background: 'var(--bg-1)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      color: 'var(--fg-3)',
      padding: '6px 10px 8px'
    }
  }, "Post as"), POST_AS.map(p => {
    const on = p.id === value.id;
    return /*#__PURE__*/React.createElement("div", {
      key: p.id,
      onClick: () => {
        onChange(p);
        setOpen(false);
      },
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        padding: '9px 10px',
        cursor: 'pointer',
        borderRadius: 'var(--radius-md)',
        background: on ? 'var(--bg-2)' : 'transparent'
      },
      onMouseEnter: e => {
        if (!on) e.currentTarget.style.background = 'var(--bg-2)';
      },
      onMouseLeave: e => {
        if (!on) e.currentTarget.style.background = 'transparent';
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      size: 32,
      colors: p.av
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 13.5px/1.2 var(--font-body)',
        color: 'var(--fg-0)'
      }
    }, p.name), p.role === 'Creator' && /*#__PURE__*/React.createElement(Icon, {
      name: "seal-check",
      size: 13,
      color: "var(--teal-bright)",
      weight: "fill"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--text-data-sm)',
        color: 'var(--fg-2)',
        marginTop: 2
      }
    }, p.role, " \xB7 ", p.handle)), on && /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 15,
      color: "var(--teal-bright)"
    }));
  })));
}

// inline "mention content" search — find & attach a title
function MentionSearch({
  onPick,
  onClose
}) {
  const [q, setQ] = React.useState('');
  const ref = React.useRef(null);
  React.useEffect(() => {
    const i = ref.current && ref.current.querySelector('input');
    i && i.focus();
  }, []);
  const ql = q.trim().toLowerCase();
  const results = ql ? window.AICDB_FILMS.filter(f => f.title.toLowerCase().includes(ql) || f.creator.toLowerCase().includes(ql)).slice(0, 5) : [];
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      marginTop: 12,
      background: 'var(--bg-2)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-default)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      padding: '10px 13px',
      borderBottom: results.length ? '1px solid var(--border-subtle)' : 'none'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "magnifying-glass",
    size: 15,
    color: "var(--fg-2)"
  }), /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Mention a title \u2014 search the catalog\u2026",
    style: {
      flex: 1,
      background: 'none',
      border: 'none',
      outline: 'none',
      color: 'var(--fg-0)',
      font: 'var(--text-body-sm)'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      display: 'flex',
      padding: 4,
      background: 'none',
      border: 'none',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 14,
    color: "var(--fg-2)"
  }))), results.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 6
    }
  }, results.map(f => /*#__PURE__*/React.createElement("div", {
    key: f.id,
    onClick: () => onPick(f),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      padding: '7px 8px',
      cursor: 'pointer',
      borderRadius: 'var(--radius-md)'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--bg-3)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 44,
      flex: 'none',
      borderRadius: 5,
      overflow: 'hidden',
      background: `linear-gradient(150deg, ${f.g[0]}, ${f.g[1]} 150%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 13px/1.2 var(--font-body)',
      color: 'var(--fg-0)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, f.title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)',
      marginTop: 2
    }
  }, f.year, " \xB7 ", f.creator)), /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 15,
    color: "var(--teal-bright)",
    weight: "bold"
  })))));
}

// composer toolbar icon button
function ComposerTool({
  icon,
  label,
  active,
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  const on = active || hover;
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    title: label,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      padding: '7px 11px',
      borderRadius: 'var(--radius-pill)',
      cursor: 'pointer',
      border: '1px solid ' + (active ? 'rgba(78,205,196,0.4)' : 'transparent'),
      background: active ? 'var(--teal-ghost)' : hover ? 'var(--bg-2)' : 'transparent',
      color: on ? 'var(--teal-bright)' : 'var(--fg-2)',
      transition: 'all var(--dur-fast)',
      font: '600 12.5px/1 var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 17,
    color: "currentColor",
    weight: "bold"
  }), /*#__PURE__*/React.createElement("span", null, label));
}

// ---- composer (creator-account version) ----
function Composer() {
  const [identity, setIdentity] = React.useState(POST_AS[1]);
  const [val, setVal] = React.useState('');
  const [mentionOpen, setMentionOpen] = React.useState(false);
  const [mention, setMention] = React.useState(null);
  const [photo, setPhoto] = React.useState(false);
  const [poll, setPoll] = React.useState(null); // null | string[]

  const togglePoll = () => setPoll(p => p ? null : ['', '']);
  const setOpt = (i, v) => setPoll(p => p.map((o, j) => j === i ? v : o));
  const addOpt = () => setPoll(p => p.length < 4 ? [...p, ''] : p);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 22px 20px',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(IdentitySelect, {
    value: identity,
    onChange: setIdentity
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    size: 46,
    colors: identity.av
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("textarea", {
    value: val,
    onChange: e => setVal(e.target.value),
    rows: 2,
    placeholder: "Share an update, a render, a hot take\u2026",
    style: {
      width: '100%',
      resize: 'none',
      background: 'none',
      border: 'none',
      outline: 'none',
      color: 'var(--fg-0)',
      font: 'var(--text-body-lg)',
      paddingTop: 8
    }
  }), photo && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginTop: 10,
      height: 150,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      background: 'repeating-linear-gradient(135deg, var(--bg-2), var(--bg-2) 11px, var(--bg-3) 11px, var(--bg-3) 22px)',
      border: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-3)',
      letterSpacing: '0.04em'
    }
  }, "photo / render"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPhoto(false),
    style: {
      position: 'absolute',
      top: 9,
      right: 9,
      display: 'flex',
      padding: 6,
      borderRadius: '50%',
      cursor: 'pointer',
      background: 'rgba(10,10,10,0.62)',
      border: '1px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 13,
    color: "#fff"
  }))), poll && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      padding: 14,
      background: 'var(--bg-2)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "overline",
    style: {
      color: 'var(--teal-bright)'
    }
  }, "Poll"), /*#__PURE__*/React.createElement("button", {
    onClick: togglePoll,
    style: {
      display: 'flex',
      padding: 3,
      background: 'none',
      border: 'none',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 14,
    color: "var(--fg-2)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, poll.map((o, i) => /*#__PURE__*/React.createElement("input", {
    key: i,
    value: o,
    onChange: e => setOpt(i, e.target.value),
    placeholder: `Option ${i + 1}`,
    style: {
      width: '100%',
      background: 'var(--bg-0)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: '9px 12px',
      color: 'var(--fg-0)',
      font: 'var(--text-body-sm)',
      outline: 'none'
    }
  }))), poll.length < 4 && /*#__PURE__*/React.createElement("button", {
    onClick: addOpt,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      marginTop: 10,
      padding: '6px 10px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--teal-bright)',
      font: '600 12.5px/1 var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 13,
    color: "var(--teal-bright)",
    weight: "bold"
  }), " Add option")), mentionOpen && !mention && /*#__PURE__*/React.createElement(MentionSearch, {
    onPick: f => {
      setMention(f);
      setMentionOpen(false);
    },
    onClose: () => setMentionOpen(false)
  }), mention && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(EmbeddedUpload, {
    film: mention,
    onOpen: () => {}
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setMention(null),
    style: {
      position: 'absolute',
      top: 20,
      right: 9,
      display: 'flex',
      padding: 6,
      borderRadius: '50%',
      cursor: 'pointer',
      background: 'var(--bg-3)',
      border: '1px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 13,
    color: "var(--fg-1)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 12,
      gap: 10,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      flexWrap: 'wrap',
      marginLeft: -4
    }
  }, /*#__PURE__*/React.createElement(ComposerTool, {
    icon: "image",
    label: "Photo",
    active: photo,
    onClick: () => setPhoto(p => !p)
  }), /*#__PURE__*/React.createElement(ComposerTool, {
    icon: "chart-bar",
    label: "Poll",
    active: !!poll,
    onClick: togglePoll
  }), /*#__PURE__*/React.createElement(ComposerTool, {
    icon: "at",
    label: "Mention content",
    active: mentionOpen || !!mention,
    onClick: () => {
      if (mention) {
        setMention(null);
      } else {
        setMentionOpen(o => !o);
      }
    }
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm"
  }, "Post")))));
}

// ---- comment-only state: shown to users without a creator account ----
function ComposerLocked({
  onNav
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 15,
      padding: '18px 22px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--bg-1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 42,
      height: 42,
      flex: 'none',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-3)',
      border: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock-simple",
    size: 19,
    color: "var(--fg-2)",
    weight: "fill"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 14.5px/1.3 var(--font-body)',
      color: 'var(--fg-0)'
    }
  }, "Posting is for creator accounts"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)',
      marginTop: 3
    }
  }, "You can upvote and comment on everything below. Create a creator account to share your own updates and releases.")), /*#__PURE__*/React.createElement("a", {
    href: "creator-setup.html",
    style: {
      flex: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      padding: '9px 16px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--coral)',
      color: 'var(--fg-on-accent)',
      textDecoration: 'none',
      font: '600 13px/1 var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus-circle",
    size: 15,
    color: "var(--fg-on-accent)",
    weight: "fill"
  }), " Create creator account"));
}

// ---- right sidebar: who to follow + trending ----
function FeedSidebar({
  onCreator,
  onOpen
}) {
  const suggested = window.AICDB_CREATORS.slice(2, 6);
  const trending = [...window.AICDB_FILMS].sort((a, b) => b.score - a.score).slice(0, 4);
  return /*#__PURE__*/React.createElement("aside", {
    className: "aicdb-feed-sidebar",
    style: {
      width: 300,
      flex: 'none',
      position: 'sticky',
      top: 78,
      alignSelf: 'flex-start',
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-1)',
      borderRadius: 'var(--radius-lg)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'var(--border-subtle)',
      padding: '6px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 16px/1 var(--font-display)',
      color: 'var(--fg-0)',
      padding: '14px 18px 10px'
    }
  }, "Who to follow"), suggested.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      padding: '10px 18px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => onCreator && onCreator(c.name),
    style: {
      cursor: 'pointer',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    size: 40,
    colors: c.av
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => onCreator && onCreator(c.name),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 13.5px/1.2 var(--font-body)',
      color: 'var(--fg-0)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, c.name), c.verified && /*#__PURE__*/React.createElement(Seal, {
    size: 13
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)',
      marginTop: 2
    }
  }, fmtCount(c.followers), " followers")), /*#__PURE__*/React.createElement(FollowPill, {
    id: c.id,
    size: "sm"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-1)',
      borderRadius: 'var(--radius-lg)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'var(--border-subtle)',
      padding: '6px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 16px/1 var(--font-display)',
      color: 'var(--fg-0)',
      padding: '14px 18px 10px'
    }
  }, "Trending now"), trending.map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: f.id,
    onClick: () => onOpen && onOpen(f),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 18px',
      cursor: 'pointer'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--bg-2)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 16px/1 var(--font-mono)',
      color: 'var(--fg-3)',
      width: 18,
      flex: 'none'
    }
  }, i + 1), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      height: 48,
      flex: 'none',
      borderRadius: 6,
      overflow: 'hidden',
      background: `linear-gradient(150deg, ${f.g[0]}, ${f.g[1]} 150%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 13.5px/1.2 var(--font-body)',
      color: 'var(--fg-0)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, f.title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)',
      marginTop: 2
    }
  }, f.creator)), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 14px/1 var(--font-mono)',
      color: scoreColor(f.score),
      flex: 'none'
    }
  }, f.score.toFixed(1))))));
}
function Feed({
  onOpen,
  onCreator,
  onNav
}) {
  const posts = window.AICDB_FEED || [];
  const [creatorMode, setCreatorMode] = React.useState(true);
  if (!posts.length) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 640,
        margin: '0 auto',
        padding: '40px 24px'
      }
    }, /*#__PURE__*/React.createElement(EmptyState, {
      icon: "users-three",
      accent: "var(--teal)",
      title: "Your feed is quiet",
      sub: "Follow some creators to see their updates, releases, and ratings here as they happen.",
      actionLabel: "Discover creators",
      onAction: () => onNav && onNav('Creators')
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: '0 auto',
      padding: '0 24px',
      display: 'flex',
      gap: 32,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      borderLeft: '1px solid var(--border-subtle)',
      borderRight: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      top: 57,
      zIndex: 20,
      padding: '16px 22px',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 14,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: '600 24px/1 var(--font-display)',
      color: 'var(--fg-0)'
    }
  }, "Feed"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-3)',
      letterSpacing: '0.03em'
    }
  }, "VIEW AS"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      padding: 3,
      gap: 2,
      background: 'var(--bg-2)',
      borderRadius: 'var(--radius-pill)',
      border: '1px solid var(--border-subtle)'
    }
  }, [['Creator', true], ['Viewer', false]].map(([lbl, val]) => {
    const on = creatorMode === val;
    return /*#__PURE__*/React.createElement("button", {
      key: lbl,
      onClick: () => setCreatorMode(val),
      style: {
        padding: '5px 13px',
        borderRadius: 'var(--radius-pill)',
        border: 'none',
        cursor: 'pointer',
        font: '600 12px/1 var(--font-body)',
        transition: 'all var(--dur-fast)',
        background: on ? 'var(--bg-3)' : 'transparent',
        color: on ? 'var(--fg-0)' : 'var(--fg-2)'
      }
    }, lbl);
  }))))), creatorMode ? /*#__PURE__*/React.createElement(Composer, null) : /*#__PURE__*/React.createElement(ComposerLocked, {
    onNav: onNav
  }), posts.map(p => /*#__PURE__*/React.createElement(PostCard, {
    key: p.id,
    post: p,
    onOpen: onOpen,
    onCreator: onCreator
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '30px 0',
      textAlign: 'center',
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)'
    }
  }, "You're all caught up. Follow more creators to see more.")), /*#__PURE__*/React.createElement(FeedSidebar, {
    onCreator: onCreator,
    onOpen: onOpen
  }));
}
Object.assign(window, {
  Feed,
  PostCard,
  Composer,
  ComposerLocked,
  FeedSidebar,
  FollowPill,
  Seal,
  creatorById,
  VoteGroup,
  PostShareButton,
  PostAction,
  CommentThread,
  IdentitySelect,
  MentionSearch,
  ComposerTool
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/Feed.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/Feedback.jsx
try { (() => {
// Dreamwall UI kit — rating feedback.
// Subtle confirmation (soft glow on the score) after any rating, and a small,
// tasteful celebratory moment the very first time a user rates on the platform.

const FEEDBACK_STYLE = `
@keyframes aicdbScorePop { 0% { transform: scale(0.7); opacity: 0; } 55% { transform: scale(1.08); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
@keyframes aicdbGlowPulse { 0% { box-shadow: 0 0 0 0 rgba(216,90,48,0.55), 0 0 0 0 rgba(216,90,48,0.0); } 70% { box-shadow: 0 0 0 18px rgba(216,90,48,0.0), 0 0 40px 6px rgba(216,90,48,0.35); } 100% { box-shadow: 0 0 0 0 rgba(216,90,48,0.0); } }
@keyframes aicdbBackdropIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes aicdbCardIn { from { opacity: 0; transform: translateY(14px) scale(0.97); } to { opacity: 1; transform: none; } }
@keyframes aicdbConfettiFall { 0% { transform: translateY(-12px) rotate(0deg); opacity: 0; } 12% { opacity: 1; } 100% { transform: translateY(240px) rotate(420deg); opacity: 0; } }
@media (prefers-reduced-motion: reduce) {
  .aicdb-pop, .aicdb-glow, .aicdb-confetti, .aicdb-cardin, .aicdb-backin { animation: none !important; }
}
`;

// localStorage-backed: has this user ever rated? record a rating, report if it was the first.
window.AICDB_RATINGS = function () {
  const KEY = 'aicdb_has_rated';
  return {
    hasRated: () => {
      try {
        return localStorage.getItem(KEY) === '1';
      } catch (e) {
        return false;
      }
    },
    record: () => {
      let first = false;
      try {
        first = localStorage.getItem(KEY) !== '1';
        localStorage.setItem(KEY, '1');
      } catch (e) {}
      return first;
    },
    reset: () => {
      try {
        localStorage.removeItem(KEY);
      } catch (e) {}
    }
  };
}();
function aicdbRecordRating() {
  return window.AICDB_RATINGS.record();
}

// glowing score disc reused by both confirm + celebration
function GlowScore({
  score,
  size = 96
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "aicdb-pop aicdb-glow",
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 38%, rgba(216,90,48,0.22), var(--bg-2))',
      border: '1px solid var(--border-accent)',
      animation: 'aicdbScorePop 0.5s var(--ease-out) both, aicdbGlowPulse 1.5s var(--ease-out) 0.15s'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: `700 ${size * 0.34}px/1 var(--font-mono)`,
      color: 'var(--coral)'
    }
  }, Number(score).toFixed(1)), /*#__PURE__*/React.createElement("span", {
    style: {
      font: `500 ${size * 0.1}px/1 var(--font-mono)`,
      color: 'var(--fg-2)',
      letterSpacing: '0.06em',
      marginTop: 3
    }
  }, "YOUR SCORE"));
}
function Confetti({
  count = 16
}) {
  const colors = ['#d85a30', '#4ecdc4', '#e5b23b', '#9d8df1', '#f5f3ef'];
  const pieces = React.useMemo(() => Array.from({
    length: count
  }).map((_, i) => ({
    left: 6 + Math.random() * 88,
    bg: colors[i % colors.length],
    delay: Math.random() * 0.35,
    dur: 1.1 + Math.random() * 0.9,
    size: 6 + Math.random() * 6,
    round: Math.random() > 0.5
  })), [count]);
  return /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      borderRadius: 'inherit'
    }
  }, pieces.map((p, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "aicdb-confetti",
    style: {
      position: 'absolute',
      top: 0,
      left: `${p.left}%`,
      width: p.size,
      height: p.size,
      background: p.bg,
      borderRadius: p.round ? '50%' : 2,
      animation: `aicdbConfettiFall ${p.dur}s var(--ease-out) ${p.delay}s both`
    }
  })));
}

// First-ever rating — a small modal celebration
function FirstRatingCelebration({
  score,
  onClose
}) {
  React.useEffect(() => {
    const t = setTimeout(onClose, 5200);
    return () => clearTimeout(t);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    className: "aicdb-backin",
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 300,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: 'rgba(5,5,5,0.74)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      animation: 'aicdbBackdropIn 0.25s var(--ease-out) both'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    className: "aicdb-cardin",
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: 380,
      textAlign: 'center',
      overflow: 'hidden',
      background: 'var(--bg-1)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-3)',
      padding: '40px 34px 32px',
      animation: 'aicdbCardIn 0.45s var(--ease-out) both'
    }
  }, /*#__PURE__*/React.createElement(Confetti, {
    count: 18
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      color: 'var(--teal-bright)',
      marginBottom: 18,
      letterSpacing: '0.14em'
    }
  }, "Your first rating"), /*#__PURE__*/React.createElement(GlowScore, {
    score: score
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: '600 25px/1.2 var(--font-display)',
      color: 'var(--fg-0)',
      margin: '24px 0 10px'
    }
  }, "You\u2019re officially a critic."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body)',
      color: 'var(--fg-2)',
      margin: '0 0 24px'
    }
  }, "That\u2019s your first score on Dreamwall. Every rating you give sharpens the community\u2019s taste \u2014 and your own."), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: onClose
  }, "Keep watching"))));
}

// Subtle confirmation toast for any (subsequent) rating
function RatingConfirm({
  score,
  onClose
}) {
  React.useEffect(() => {
    const t = setTimeout(onClose, 2400);
    return () => clearTimeout(t);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "aicdb-cardin",
    style: {
      position: 'fixed',
      left: '50%',
      bottom: 32,
      transform: 'translateX(-50%)',
      zIndex: 300,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '14px 20px 14px 16px',
      background: 'var(--bg-1)',
      border: '1px solid var(--border-accent)',
      borderRadius: 'var(--radius-pill)',
      boxShadow: 'var(--shadow-3)',
      animation: 'aicdbCardIn 0.4s var(--ease-out) both'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "aicdb-pop aicdb-glow",
    style: {
      width: 46,
      height: 46,
      borderRadius: '50%',
      flex: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--coral-ghost)',
      border: '1px solid var(--border-accent)',
      animation: 'aicdbScorePop 0.45s var(--ease-out) both, aicdbGlowPulse 1.4s var(--ease-out) 0.1s'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 17px/1 var(--font-mono)',
      color: 'var(--coral)'
    }
  }, Number(score).toFixed(1))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 14px/1.2 var(--font-body)',
      color: 'var(--fg-0)'
    }
  }, "Rating saved"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)',
      marginTop: 2
    }
  }, "Thanks \u2014 your score is in.")), /*#__PURE__*/React.createElement(Icon, {
    name: "check-circle",
    size: 20,
    color: "var(--teal-bright)",
    weight: "fill"
  }));
}

// Convenience: render the right feedback given (score, wasFirst)
function RatingFeedback({
  score,
  first,
  onClose
}) {
  return first ? /*#__PURE__*/React.createElement(FirstRatingCelebration, {
    score: score,
    onClose: onClose
  }) : /*#__PURE__*/React.createElement(RatingConfirm, {
    score: score,
    onClose: onClose
  });
}
Object.assign(window, {
  FEEDBACK_STYLE,
  GlowScore,
  Confetti,
  FirstRatingCelebration,
  RatingConfirm,
  RatingFeedback,
  aicdbRecordRating
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/Feedback.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/FeedbackFlama.jsx
try { (() => {
// Dreamwall UI kit — "Feedback Flama"
// A small teal pennant pinned to the top-left corner of every page. Hovering
// shows a tooltip ("Report a problem on this page"); clicking opens a beta
// bug-report modal (description + optional screenshot + golden-badge reward).
// Self-mounting: include once after Primitives.jsx and it injects itself.

const FLAMA_STYLE = `
@keyframes aicdbBannerSway { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(2.4deg); } }
@keyframes aicdbFlamaIn   { from { opacity:0; transform: translateY(14px) scale(0.97); } to { opacity:1; transform:none; } }
@keyframes aicdbFlamaBack { from { opacity:0; } to { opacity:1; } }
.aicdb-flama-banner { transform-origin: 50% 4px; transition: filter var(--dur-fast); }
.aicdb-flama-pole:hover .aicdb-flama-banner { animation: aicdbBannerSway 1.5s var(--ease-in-out) infinite; filter: drop-shadow(0 6px 10px rgba(0,0,0,0.5)); }
@media (prefers-reduced-motion: reduce) { .aicdb-flama-banner { animation: none !important; } }
`;

// the heraldic banner mark — a deep-blue velvet gonfalon with ornate gold trim and
// a central "!", suspended by a cord so it hangs below the logo.
function HeraldBanner() {
  return /*#__PURE__*/React.createElement("svg", {
    className: "aicdb-flama-banner",
    width: "21",
    height: "30",
    viewBox: "0 0 56 80",
    "aria-hidden": "true",
    style: {
      display: 'block',
      overflow: 'visible',
      opacity: 0.5,
      filter: 'saturate(0.85) brightness(0.96) drop-shadow(0 3px 5px rgba(0,0,0,0.4))'
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "aicdbVelvet",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#2c3f7e"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "32%",
    stopColor: "#1b2c61"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#0e1840"
  })), /*#__PURE__*/React.createElement("radialGradient", {
    id: "aicdbSheen",
    cx: "36%",
    cy: "24%",
    r: "72%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#5066a8",
    stopOpacity: "0.55"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "55%",
    stopColor: "#2a3a72",
    stopOpacity: "0.12"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#0e1840",
    stopOpacity: "0"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "aicdbGold",
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#f7e6a8"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "34%",
    stopColor: "#d3a24c"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "70%",
    stopColor: "#9c6a2c"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#6f4618"
  })), /*#__PURE__*/React.createElement("radialGradient", {
    id: "aicdbStud",
    cx: "38%",
    cy: "32%",
    r: "70%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#fbeeb6"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "60%",
    stopColor: "#cf9a3d"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#7d5018"
  })), /*#__PURE__*/React.createElement("filter", {
    id: "aicdbWeave",
    x: "-10%",
    y: "-10%",
    width: "120%",
    height: "120%"
  }, /*#__PURE__*/React.createElement("feTurbulence", {
    type: "fractalNoise",
    baseFrequency: "0.9 0.45",
    numOctaves: "2",
    seed: "7",
    result: "n"
  }), /*#__PURE__*/React.createElement("feColorMatrix", {
    in: "n",
    type: "matrix",
    values: "0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0"
  })), /*#__PURE__*/React.createElement("clipPath", {
    id: "aicdbBannerClip"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 10 L50 10 L50 56 L28 72 L6 56 Z"
  }))), /*#__PURE__*/React.createElement("line", {
    x1: "28",
    y1: "2",
    x2: "28",
    y2: "11",
    stroke: "url(#aicdbGold)",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "28",
    cy: "4",
    r: "3",
    fill: "none",
    stroke: "url(#aicdbGold)",
    strokeWidth: "1.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 10 L50 10 L50 56 L28 72 L6 56 Z",
    fill: "url(#aicdbVelvet)"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 10 L50 10 L50 56 L28 72 L6 56 Z",
    fill: "url(#aicdbSheen)"
  }), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#aicdbBannerClip)"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "0",
    width: "56",
    height: "80",
    filter: "url(#aicdbWeave)",
    opacity: "0.22"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "6",
    y: "10",
    width: "44",
    height: "20",
    fill: "#7187c9",
    opacity: "0.12"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "15",
    y: "10",
    width: "1",
    height: "58",
    fill: "#6479bd",
    opacity: "0.12"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "40",
    y: "10",
    width: "1",
    height: "58",
    fill: "#6479bd",
    opacity: "0.12"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "27",
    y: "10",
    width: "1.4",
    height: "60",
    fill: "#0a1230",
    opacity: "0.18"
  })), /*#__PURE__*/React.createElement("path", {
    d: "M6 10 L50 10 L50 56 L28 72 L6 56 Z",
    fill: "none",
    stroke: "url(#aicdbGold)",
    strokeWidth: "2.6",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9.5 13.5 L46.5 13.5 L46.5 54.4 L28 67.5 L9.5 54.4 Z",
    fill: "none",
    stroke: "url(#aicdbGold)",
    strokeWidth: "1",
    strokeOpacity: "0.8",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "10",
    r: "2.6",
    fill: "url(#aicdbStud)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "10",
    r: "2.6",
    fill: "url(#aicdbStud)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "28",
    cy: "72",
    r: "2.4",
    fill: "url(#aicdbStud)"
  }), /*#__PURE__*/React.createElement("text", {
    x: "28.8",
    y: "46",
    textAnchor: "middle",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontWeight: "700",
    fontSize: "34",
    fill: "#0c1430",
    opacity: "0.55"
  }, "!"), /*#__PURE__*/React.createElement("text", {
    x: "28",
    y: "45.2",
    textAnchor: "middle",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontWeight: "700",
    fontSize: "34",
    fill: "#f4e7c0"
  }, "!"));
}

// current page label, derived from the document title ("Dreamwall — Profile" -> "Profile")
function aicdbPageName() {
  const t = (document.title || '').replace(/^Dreamwall\s*[—–-]\s*/i, '').trim();
  return t || 'this page';
}

// minimal optional-screenshot dropzone (no external deps)
function FlamaShot({
  value,
  onChange
}) {
  const ref = React.useRef(null);
  const [hover, setHover] = React.useState(false);
  const pick = file => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => onChange(r.result);
    r.readAsDataURL(file);
  };
  return /*#__PURE__*/React.createElement("div", {
    onClick: () => ref.current && ref.current.click(),
    onDragOver: e => {
      e.preventDefault();
      setHover(true);
    },
    onDragLeave: () => setHover(false),
    onDrop: e => {
      e.preventDefault();
      setHover(false);
      pick(e.dataTransfer.files[0]);
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '13px 15px',
      cursor: 'pointer',
      borderRadius: 'var(--radius-md)',
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: hover ? 'var(--border-accent)' : 'var(--border-strong)',
      background: value ? 'var(--bg-inset)' : 'var(--bg-0)',
      transition: 'border-color var(--dur-fast)'
    }
  }, value ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("img", {
    src: value,
    alt: "",
    style: {
      width: 46,
      height: 46,
      objectFit: 'cover',
      borderRadius: 'var(--radius-sm)',
      flex: 'none'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      font: 'var(--text-body-sm)',
      color: 'var(--fg-1)'
    }
  }, "Screenshot attached"), /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onChange(null);
    },
    style: {
      display: 'flex',
      padding: 6,
      borderRadius: '50%',
      cursor: 'pointer',
      background: 'var(--bg-2)',
      border: '1px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 13,
    color: "var(--fg-1)"
  }))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
    name: "image",
    size: 19,
    color: hover ? 'var(--teal-bright)' : 'var(--fg-2)'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 13px/1.2 var(--font-body)',
      color: 'var(--fg-1)'
    }
  }, "Add a screenshot"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-3)',
      marginTop: 3,
      letterSpacing: '0.03em'
    }
  }, "Optional \xB7 drag or click to upload"))), /*#__PURE__*/React.createElement("input", {
    ref: ref,
    type: "file",
    accept: "image/*",
    style: {
      display: 'none'
    },
    onChange: e => pick(e.target.files[0])
  }));
}
function BugReportModal({
  onClose
}) {
  const [desc, setDesc] = React.useState('');
  const [shot, setShot] = React.useState(null);
  const [sent, setSent] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const page = aicdbPageName();
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 2147483000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: 'rgba(5,5,5,0.74)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      animation: 'aicdbFlamaBack 0.22s var(--ease-out) both'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: 468,
      background: 'var(--bg-1)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-3)',
      overflow: 'hidden',
      animation: 'aicdbFlamaIn 0.4s var(--ease-out) both'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      position: 'absolute',
      top: 16,
      right: 16,
      zIndex: 2,
      display: 'flex',
      padding: 8,
      borderRadius: '50%',
      cursor: 'pointer',
      background: 'var(--bg-2)',
      border: '1px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 15,
    color: "var(--fg-1)"
  })), sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '44px 34px 38px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 74,
      height: 74,
      margin: '0 auto 22px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--teal-ghost)',
      border: '1px solid rgba(78,205,196,0.4)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "flag-pennant",
    size: 34,
    color: "var(--teal-bright)",
    weight: "fill"
  })), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: '600 24px/1.2 var(--font-display)',
      color: 'var(--fg-0)',
      margin: '0 0 10px'
    }
  }, "Report sent"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body)',
      color: 'var(--fg-2)',
      margin: '0 0 24px',
      maxWidth: 340,
      marginInline: 'auto'
    }
  }, "Thanks for helping us debug Dreamwall. If we confirm it, a golden Bug Hunter badge lands on your profile."), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '11px 22px',
      cursor: 'pointer',
      borderRadius: 'var(--radius-md)',
      border: 'none',
      background: 'var(--coral)',
      color: 'var(--fg-on-accent)',
      font: '600 14px/1 var(--font-body)'
    }
  }, "Done")) : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '26px 26px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      padding: '13px 15px',
      marginBottom: 22,
      borderRadius: 'var(--radius-md)',
      background: 'var(--teal-ghost)',
      border: '1px solid rgba(78,205,196,0.32)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "flask",
    size: 18,
    color: "var(--teal-bright)",
    weight: "fill",
    style: {
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-1)'
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--teal-bright)',
      fontWeight: 600
    }
  }, "Dreamwall is in beta."), " Spotted something broken or off? Tell us what happened and we'll get it fixed.")), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: '600 22px/1.2 var(--font-display)',
      color: 'var(--fg-0)',
      margin: '0 0 6px'
    }
  }, "Report a problem"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      marginBottom: 18,
      padding: '5px 11px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--bg-2)',
      border: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: 12,
    color: "var(--fg-2)",
    weight: "fill"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)'
    }
  }, "Reporting from"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 12px/1 var(--font-body)',
      color: 'var(--fg-0)'
    }
  }, page)), /*#__PURE__*/React.createElement("label", {
    style: {
      font: '600 13px/1 var(--font-body)',
      color: 'var(--fg-0)',
      display: 'block',
      marginBottom: 8
    }
  }, "What went wrong?"), /*#__PURE__*/React.createElement("textarea", {
    value: desc,
    onChange: e => setDesc(e.target.value),
    rows: 4,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    placeholder: "Describe the bug \u2014 what you did, what you expected, what happened instead.",
    style: {
      width: '100%',
      resize: 'vertical',
      minHeight: 96,
      lineHeight: 1.55,
      background: 'var(--bg-0)',
      color: 'var(--fg-0)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: focus ? 'var(--border-accent)' : 'var(--border-subtle)',
      boxShadow: focus ? 'var(--glow-coral)' : 'none',
      borderRadius: 'var(--radius-md)',
      padding: '11px 14px',
      font: 'var(--text-body)',
      outline: 'none',
      transition: 'border-color var(--dur-fast), box-shadow var(--dur-fast)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(FlamaShot, {
    value: shot,
    onChange: setShot
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => setSent(true),
    disabled: !desc.trim(),
    style: {
      width: '100%',
      marginTop: 18,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: '13px 0',
      borderRadius: 'var(--radius-md)',
      border: 'none',
      cursor: desc.trim() ? 'pointer' : 'not-allowed',
      font: '600 14px/1 var(--font-body)',
      transition: 'background var(--dur-fast)',
      background: desc.trim() ? 'var(--coral)' : 'var(--bg-3)',
      color: desc.trim() ? 'var(--fg-on-accent)' : 'var(--fg-3)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "paper-plane-tilt",
    size: 16,
    color: desc.trim() ? 'var(--fg-on-accent)' : 'var(--fg-3)',
    weight: "fill"
  }), " Send report"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 13,
      marginTop: 20,
      paddingTop: 18,
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 42,
      height: 42,
      flex: 'none',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 38% 30%, #f6d579, #d99a23 70%, #a9711a)',
      boxShadow: '0 2px 10px rgba(217,154,35,0.45), inset 0 1px 3px rgba(255,255,255,0.45)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "medal",
    size: 22,
    color: "#3a2a06",
    weight: "fill"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)'
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      color: '#e5b23b',
      fontWeight: 600
    }
  }, "Bug Hunter badge."), " Every confirmed report earns a golden badge that shows on your profile.")))));
}
function FeedbackFlama() {
  const [open, setOpen] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, FLAMA_STYLE), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      top: 45,
      left: 33,
      zIndex: 2147482000
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "aicdb-flama-pole",
    onClick: () => setOpen(true),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    "aria-label": "Report a problem on this page",
    style: {
      display: 'block',
      padding: 0,
      cursor: 'pointer',
      background: 'none',
      border: 'none'
    }
  }, /*#__PURE__*/React.createElement(HeraldBanner, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 11,
      left: 30,
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      padding: '6px 11px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--bg-2)',
      border: '1px solid var(--border-default)',
      boxShadow: 'var(--shadow-2)',
      font: '500 12px/1 var(--font-body)',
      color: 'var(--fg-0)',
      opacity: hover ? 1 : 0,
      transform: hover ? 'translateX(0)' : 'translateX(-4px)',
      transition: 'opacity var(--dur-fast), transform var(--dur-fast)'
    }
  }, "Report a problem on this page")), open && /*#__PURE__*/React.createElement(BugReportModal, {
    onClose: () => setOpen(false)
  }));
}
Object.assign(window, {
  FeedbackFlama,
  BugReportModal,
  HeraldBanner
});

// ---- self-mount ----
(function mountFlama() {
  function go() {
    if (document.getElementById('aicdb-flama-root')) return;
    const el = document.createElement('div');
    el.id = 'aicdb-flama-root';
    document.body.appendChild(el);
    ReactDOM.createRoot(el).render(/*#__PURE__*/React.createElement(FeedbackFlama, null));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go);else go();
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/FeedbackFlama.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/FilmCard.jsx
try { (() => {
// Dreamwall UI kit — minimal YTS-style film card.
// Poster only by default; title + year below; dark overlay on hover reveals
// score + type badge, plus duration and an add-to-watchlist button.
function WatchlistButton({
  film,
  size = 30
}) {
  const ids = useWatchlist();
  const inList = ids.includes(film.id);
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      window.AICDB_WATCHLIST.toggle(film.id);
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    title: inList ? 'In watchlist' : 'Add to watchlist',
    style: {
      width: size,
      height: size,
      flex: 'none',
      borderRadius: '50%',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid ' + (inList ? 'transparent' : 'rgba(255,255,255,0.5)'),
      background: inList ? 'var(--coral)' : hover ? 'rgba(255,255,255,0.18)' : 'rgba(10,10,10,0.45)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      transition: 'all var(--dur-fast) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: inList ? 'check' : 'plus',
    size: size * 0.5,
    color: inList ? '#1a0d08' : '#fff'
  }));
}
function FilmCard({
  film,
  onOpen,
  width = 150
}) {
  const [hover, setHover] = React.useState(false);
  const t = window.AICDB_TYPES[film.type];
  const aspect = film.type === 'vertical' ? '9/16' : '2/3';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      cursor: 'pointer'
    },
    onClick: () => onOpen && onOpen(film),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: aspect,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      position: 'relative',
      boxShadow: 'var(--shadow-poster)',
      background: `linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 150%)`,
      transition: 'transform var(--dur-base) var(--ease-out), filter var(--dur-base) var(--ease-out)',
      transform: hover ? 'translateY(-3px) scale(1.015)' : 'none',
      filter: hover ? 'brightness(1.08)' : 'brightness(1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 9,
      left: 9,
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement(ContentRibbon, {
    film: film,
    size: "sm"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      opacity: hover ? 1 : 0,
      transition: 'opacity var(--dur-base) var(--ease-out)',
      background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.12) 55%, rgba(0,0,0,0.4) 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: 11
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(WatchlistButton, {
    film: film
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(ScoreLine, {
    film: film,
    size: 22,
    countColor: "rgba(255,255,255,0.7)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '4px 8px',
      borderRadius: 'var(--radius-pill)',
      background: 'rgba(10,10,10,0.55)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      font: '600 11px/1 var(--font-mono)',
      color: 'rgba(255,255,255,0.92)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 11,
    color: "rgba(255,255,255,0.7)"
  }), formatDuration(film))))), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 13.5px/1.25 var(--font-body)',
      color: 'var(--fg-0)',
      marginTop: 9
    }
  }, film.title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)',
      marginTop: 2
    }
  }, film.year));
}
function FilmRow({
  title,
  sub,
  films,
  onOpen
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      marginBottom: 48
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--text-h3)',
      color: 'var(--fg-0)',
      letterSpacing: '-0.005em'
    }
  }, title), sub && /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)',
      margin: '5px 0 0'
    }
  }, sub)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: 20
    }
  }, films.map((f, i) => /*#__PURE__*/React.createElement(FilmCard, {
    key: f.id + '-' + i,
    film: f,
    onOpen: onOpen,
    width: "auto"
  }))));
}
Object.assign(window, {
  FilmCard,
  FilmRow,
  WatchlistButton
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/FilmCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/FilmDetail.jsx
try { (() => {
// Dreamwall UI kit — film/series detail page
function ReviewItem({
  r
}) {
  const [liked, setLiked] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      padding: '18px 0',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    colors: r.av,
    size: 38
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 14px/1 var(--font-body)',
      color: 'var(--fg-0)'
    }
  }, r.user), r.stars != null && /*#__PURE__*/React.createElement(StarRating, {
    value: r.stars,
    size: 14
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)'
    }
  }, r.when)), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body)',
      color: 'var(--fg-1)',
      margin: '0 0 10px'
    }
  }, r.body), /*#__PURE__*/React.createElement("button", {
    onClick: () => setLiked(!liked),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      font: '500 12px/1 var(--font-body)',
      color: liked ? 'var(--coral)' : 'var(--fg-2)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "heart",
    size: 15,
    fill: liked ? 'var(--coral)' : 'none',
    color: liked ? 'var(--coral)' : 'currentColor'
  }), r.likes + (liked ? 1 : 0))));
}

// Left-column action button (consistent secondary style)
function SideButton({
  icon,
  children,
  onClick,
  primary
}) {
  const [hover, setHover] = React.useState(false);
  const base = {
    width: '100%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '12px 16px',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    font: '600 14px/1 var(--font-body)',
    transition: 'all var(--dur-fast)'
  };
  const style = primary ? {
    ...base,
    border: 'none',
    background: hover ? 'var(--coral-bright)' : 'var(--coral)',
    color: 'var(--fg-on-accent)'
  } : {
    ...base,
    border: '1px solid var(--border-strong)',
    background: hover ? 'var(--bg-2)' : 'transparent',
    color: 'var(--fg-0)'
  };
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: style
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 16,
    fill: primary && icon === 'play' ? 'currentColor' : 'none',
    color: "currentColor"
  }), children);
}
function FilmDetail({
  film,
  onBack,
  onWatch,
  onCreator,
  onOpen
}) {
  const d = window.AICDB_DETAILS[film.id] || {};
  const t = window.AICDB_TYPES[film.type];
  const isSeries = film.type === 'series';
  const [userScore, setUserScore] = React.useState(0);
  const [rateOpen, setRateOpen] = React.useState(false);
  const [reviewOpen, setReviewOpen] = React.useState(false);
  const [reviews, setReviews] = React.useState(window.AICDB_REVIEWS);
  const [feedback, setFeedback] = React.useState(null); // { score, first }

  const handleRated = avg => {
    setUserScore(avg);
    setRateOpen(false);
    const first = window.aicdbRecordRating ? window.aicdbRecordRating() : false;
    setFeedback({
      score: avg,
      first
    });
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 360,
      background: `linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 170%)`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to bottom, rgba(10,10,10,0.32) 0%, rgba(10,10,10,0.72) 62%, var(--bg-0) 100%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1100,
      margin: '0 auto',
      height: '100%',
      padding: '0 28px',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("blockquote", {
    style: {
      position: 'absolute',
      right: 28,
      bottom: 120,
      maxWidth: 560,
      margin: 0,
      textAlign: 'right',
      fontFamily: '"Times New Roman", Times, serif',
      fontStyle: 'italic',
      fontWeight: 400,
      fontSize: 34,
      lineHeight: 1.25,
      color: 'rgba(245,243,239,0.92)',
      textShadow: '0 2px 20px rgba(0,0,0,0.7)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 54,
      lineHeight: 0,
      verticalAlign: '-0.35em',
      opacity: 0.5,
      marginRight: 4
    }
  }, "\u201C"), d.quote || film.synopsis.split('.')[0] + '.'))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 1100,
      margin: '0 auto',
      padding: '20px 28px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: 'rgba(0,0,0,0.4)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-pill)',
      padding: '8px 14px',
      cursor: 'pointer',
      color: 'var(--fg-0)',
      font: '500 13px/1 var(--font-body)',
      backdropFilter: 'blur(8px)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-left",
    size: 16
  }), " Discover"))), /*#__PURE__*/React.createElement("div", {
    className: "aicdb-detail-header",
    style: {
      maxWidth: 1100,
      margin: '0 auto',
      padding: '0 28px',
      display: 'flex',
      gap: 36,
      marginTop: -90,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "aicdb-detail-poster",
    style: {
      width: 240,
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: film.type === 'vertical' ? '9/16' : '2/3',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      background: `linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 150%)`,
      boxShadow: 'var(--shadow-poster)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(SideButton, {
    icon: "play",
    primary: true,
    onClick: () => onWatch && onWatch(film)
  }, "Watch"), /*#__PURE__*/React.createElement(WatchlistSplit, {
    film: film
  }), /*#__PURE__*/React.createElement(SideButton, {
    icon: "star",
    onClick: () => setRateOpen(true)
  }, userScore ? `Rated ${userScore.toFixed(1)}` : 'Rate'), /*#__PURE__*/React.createElement(ShareButton, null))), /*#__PURE__*/React.createElement("div", {
    className: "aicdb-detail-info",
    style: {
      flex: 1,
      paddingTop: 104,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 32,
      alignItems: 'flex-start',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 360px',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(ContentBadge, {
    type: film.type
  }), /*#__PURE__*/React.createElement(ContentRibbon, {
    film: film,
    size: "sm"
  }), film.genres.map(g => /*#__PURE__*/React.createElement("span", {
    key: g,
    style: {
      font: '500 12px/1 var(--font-body)',
      color: 'var(--fg-1)'
    }
  }, g)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      font: '500 12px/1 var(--font-body)',
      color: 'var(--teal-bright)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 13,
    color: "var(--teal-bright)"
  }), film.technique)), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--text-h1)',
      color: 'var(--fg-0)',
      letterSpacing: '-0.015em',
      marginBottom: 10
    }
  }, film.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      font: 'var(--text-data)',
      color: 'var(--fg-1)',
      marginBottom: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", null, film.year), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-3)'
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 14,
    color: "var(--fg-2)"
  }), film.runtime), isSeries && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-3)'
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      color: 'var(--teal-bright)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "television-simple",
    size: 14,
    color: "var(--teal-bright)"
  }), d.seasons, " ", d.seasons === 1 ? 'season' : 'seasons', " \xB7 ", d.episodes, " episodes"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 24,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-body)',
      color: 'var(--fg-1)'
    }
  }, "By ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-0)',
      fontWeight: 600
    }
  }, film.creator)), /*#__PURE__*/React.createElement("a", {
    onClick: () => onCreator && onCreator(film.creator),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      cursor: 'pointer',
      color: 'var(--teal)',
      font: '600 13px/1 var(--font-body)'
    }
  }, "Go to Creator's Page ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 13,
    color: "var(--teal)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 420,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(DualScore, {
    film: film,
    userScore: userScore
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-lg)',
      color: 'var(--fg-1)',
      maxWidth: 620,
      margin: 0
    }
  }, film.synopsis)), /*#__PURE__*/React.createElement("div", {
    className: "aicdb-detail-gauge",
    style: {
      flex: 'none',
      width: 258,
      maxWidth: '100%'
    }
  }, /*#__PURE__*/React.createElement(ExtraordinaryMeter, {
    film: film
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1100,
      margin: '0 auto',
      padding: '0 28px 90px'
    }
  }, /*#__PURE__*/React.createElement(CreditsSection, {
    film: film
  }), /*#__PURE__*/React.createElement(StatsSection, {
    film: film
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 48
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--text-h2)',
      color: 'var(--fg-0)'
    }
  }, "Reviews"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    icon: "pencil",
    size: "sm",
    onClick: () => setReviewOpen(true)
  }, "Add review")), reviewOpen && /*#__PURE__*/React.createElement(AddReviewBox, {
    onCancel: () => setReviewOpen(false),
    onPost: rev => {
      setReviews(rs => [rev, ...rs]);
      setReviewOpen(false);
    }
  }), /*#__PURE__*/React.createElement("div", null, reviews.map((r, i) => /*#__PURE__*/React.createElement(ReviewItem, {
    key: i,
    r: r
  })))), /*#__PURE__*/React.createElement(ProductionSection, {
    film: film
  }), /*#__PURE__*/React.createElement(MoreLikeThis, {
    film: film,
    onOpen: onOpen
  })), rateOpen && /*#__PURE__*/React.createElement(RatingPanel, {
    film: film,
    onClose: () => setRateOpen(false),
    onSubmit: handleRated
  }), feedback && /*#__PURE__*/React.createElement(RatingFeedback, {
    score: feedback.score,
    first: feedback.first,
    onClose: () => setFeedback(null)
  }));
}
Object.assign(window, {
  FilmDetail,
  ReviewItem,
  SideButton
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/FilmDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/Login.jsx
try { (() => {
// Dreamwall UI kit — Login / sign-in screen
function SocialButton({
  icon,
  label,
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      width: '100%',
      padding: '12px 16px',
      background: hover ? 'var(--bg-2)' : 'var(--bg-1)',
      color: 'var(--fg-0)',
      border: '1px solid',
      borderColor: hover ? 'var(--border-strong)' : 'var(--border-default)',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      font: '500 14px/1 var(--font-body)',
      transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      display: 'flex',
      justifyContent: 'center'
    }
  }, icon), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      textAlign: 'left'
    }
  }, label));
}
function Field({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  trailing
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "overline",
    style: {
      display: 'block',
      marginBottom: 7,
      color: 'var(--fg-2)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: 'var(--bg-3)',
      minWidth: 0,
      border: '1px solid',
      borderColor: focus ? 'var(--border-accent)' : 'var(--border-default)',
      borderRadius: 'var(--radius-md)',
      padding: '0 12px',
      boxShadow: focus ? 'var(--glow-coral)' : 'none',
      transition: 'border-color var(--dur-fast), box-shadow var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: type,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      width: 0,
      background: 'none',
      border: 'none',
      outline: 'none',
      color: 'var(--fg-0)',
      font: 'var(--text-body)',
      padding: '12px 0'
    }
  }), trailing));
}
function PrimaryWideButton({
  children,
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: '100%',
      padding: '13px 16px',
      marginTop: 4,
      background: hover ? 'var(--coral-bright)' : 'var(--coral)',
      color: 'var(--fg-on-accent)',
      border: 'none',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      font: '600 15px/1 var(--font-body)',
      letterSpacing: '0.01em',
      transition: 'background var(--dur-fast) var(--ease-out)'
    }
  }, children);
}
function Login() {
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);
  const socials = [{
    key: 'google',
    icon: /*#__PURE__*/React.createElement(GoogleIcon, {
      size: 18
    }),
    label: 'Continue with Google'
  }, {
    key: 'facebook',
    icon: /*#__PURE__*/React.createElement(FacebookIcon, {
      size: 18
    }),
    label: 'Continue with Facebook'
  }, {
    key: 'instagram',
    icon: /*#__PURE__*/React.createElement(InstagramIcon, {
      size: 18
    }),
    label: 'Continue with Instagram'
  }, {
    key: 'x',
    icon: /*#__PURE__*/React.createElement(XIcon, {
      size: 15
    }),
    label: 'Continue with X'
  }, {
    key: 'tiktok',
    icon: /*#__PURE__*/React.createElement(TikTokIcon, {
      size: 17
    }),
    label: 'Continue with TikTok'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 20px',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      background: 'radial-gradient(120% 90% at 18% 8%, rgba(216,90,48,0.16) 0%, rgba(216,90,48,0) 42%),' + 'radial-gradient(110% 80% at 88% 92%, rgba(78,205,196,0.13) 0%, rgba(78,205,196,0) 46%),' + 'radial-gradient(80% 60% at 70% 18%, rgba(157,141,241,0.10) 0%, rgba(157,141,241,0) 50%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      opacity: 0.5,
      backgroundImage: 'radial-gradient(rgba(245,243,239,0.035) 1px, transparent 1px)',
      backgroundSize: '4px 4px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      width: '100%',
      maxWidth: 404,
      background: 'rgba(21,21,20,0.82)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-3)',
      padding: '38px 36px 30px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: window.__resources && window.__resources.aicdbMark || "../../assets/aicdb-mark.png",
    width: "52",
    height: "52",
    alt: "",
    style: {
      filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.6))',
      marginBottom: 18
    }
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: '600 27px/1.1 var(--font-display)',
      letterSpacing: '-0.01em',
      color: 'var(--fg-0)',
      marginBottom: 8
    }
  }, "Sign in to Dreamwall"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-1)',
      margin: 0,
      maxWidth: 280
    }
  }, "Rate and track the best AI-generated films & series.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, socials.map(s => /*#__PURE__*/React.createElement(SocialButton, {
    key: s.key,
    icon: s.icon,
    label: s.label,
    onClick: () => {}
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      margin: '22px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: 'var(--border-default)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "overline",
    style: {
      color: 'var(--fg-3)'
    }
  }, "or with email"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: 'var(--border-default)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Email",
    type: "email",
    value: email,
    onChange: e => setEmail(e.target.value),
    placeholder: "you@example.com"
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Password",
    type: showPw ? 'text' : 'password',
    value: pw,
    onChange: e => setPw(e.target.value),
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    trailing: /*#__PURE__*/React.createElement("button", {
      onClick: () => setShowPw(v => !v),
      "aria-label": "Toggle password",
      style: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 4,
        display: 'flex',
        color: 'var(--fg-2)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: showPw ? 'eye' : 'eye',
      size: 17
    }))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      marginTop: -4
    }
  }, /*#__PURE__*/React.createElement("a", {
    style: {
      font: '500 12.5px/1 var(--font-body)',
      color: 'var(--fg-1)',
      cursor: 'pointer'
    }
  }, "Forgot password?")), /*#__PURE__*/React.createElement(PrimaryWideButton, {
    onClick: () => {}
  }, "Sign in")), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'center',
      font: 'var(--text-body-sm)',
      color: 'var(--fg-1)',
      margin: '24px 0 0'
    }
  }, "New to Dreamwall? ", /*#__PURE__*/React.createElement("a", {
    href: "signup.html",
    style: {
      color: 'var(--teal)',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "Create an account"))));
}
Object.assign(window, {
  Login,
  SocialButton,
  Field
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/Login.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/LoginModal.jsx
try { (() => {
// Dreamwall UI kit — Login modal / popup (gate for logged-out actions)
// Reuses SocialButton, PrimaryWideButton, GoogleIcon… from Login.jsx + BrandIcons.jsx.

function LoginModal({
  open,
  onClose,
  trigger
}) {
  const [showEmail, setShowEmail] = React.useState(false);

  // reset to social view each time it reopens
  React.useEffect(() => {
    if (open) setShowEmail(false);
  }, [open]);

  // close on Escape
  React.useEffect(() => {
    if (!open) return;
    const h = e => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);
  if (!open) return null;
  const socials = [{
    key: 'google',
    icon: /*#__PURE__*/React.createElement(GoogleIcon, {
      size: 18
    }),
    label: 'Continue with Google'
  }, {
    key: 'facebook',
    icon: /*#__PURE__*/React.createElement(FacebookIcon, {
      size: 18
    }),
    label: 'Continue with Facebook'
  }, {
    key: 'instagram',
    icon: /*#__PURE__*/React.createElement(InstagramIcon, {
      size: 18
    }),
    label: 'Continue with Instagram'
  }, {
    key: 'x',
    icon: /*#__PURE__*/React.createElement(XIcon, {
      size: 15
    }),
    label: 'Continue with X'
  }, {
    key: 'tiktok',
    icon: /*#__PURE__*/React.createElement(TikTokIcon, {
      size: 17
    }),
    label: 'Continue with TikTok'
  }];
  const headline = trigger === 'watchlist' ? 'Save to your watchlist' : 'Sign in to watch';
  const sub = trigger === 'watchlist' ? 'Create a free account to track films & series you want to watch.' : 'Sign in or create a free account to start watching.';
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'rgba(5,5,5,0.72)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      animation: 'aicdbFade var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: 380,
      maxHeight: '90vh',
      overflowY: 'auto',
      background: 'var(--bg-1)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-3)',
      padding: '30px 30px 26px',
      animation: 'aicdbPop var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close",
    style: {
      position: 'absolute',
      top: 14,
      right: 14,
      width: 32,
      height: 32,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-2)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-pill)',
      cursor: 'pointer',
      color: 'var(--fg-1)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: window.__resources && window.__resources.aicdbMark || "../../assets/aicdb-mark.png",
    width: "40",
    height: "40",
    alt: "",
    style: {
      filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.6))',
      marginBottom: 12
    }
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: '600 20px/1.15 var(--font-display)',
      letterSpacing: '-0.01em',
      color: 'var(--fg-0)',
      marginBottom: 6
    }
  }, headline), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-1)',
      margin: 0,
      maxWidth: 280
    }
  }, sub)), !showEmail ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 9
    }
  }, socials.map(s => /*#__PURE__*/React.createElement(SocialButton, {
    key: s.key,
    icon: s.icon,
    label: s.label,
    onClick: () => {}
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      margin: '18px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: 'var(--border-default)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "overline",
    style: {
      color: 'var(--fg-3)'
    }
  }, "or"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: 'var(--border-default)'
    }
  })), /*#__PURE__*/React.createElement(PrimaryWideButton, {
    onClick: () => setShowEmail(true)
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "mail",
    size: 16
  }), " Continue with email"))) : /*#__PURE__*/React.createElement(ModalEmailForm, {
    onBack: () => setShowEmail(false)
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'center',
      font: 'var(--text-body-sm)',
      color: 'var(--fg-1)',
      margin: '20px 0 0'
    }
  }, "New to Dreamwall? ", /*#__PURE__*/React.createElement("a", {
    href: "signup.html",
    style: {
      color: 'var(--teal)',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "Sign up"))));
}
function ModalEmailForm({
  onBack
}) {
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      marginBottom: 12,
      color: 'var(--fg-1)',
      font: '500 13px/1 var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-left",
    size: 15
  }), " All options"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 13
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Email",
    type: "email",
    value: email,
    onChange: e => setEmail(e.target.value),
    placeholder: "you@example.com"
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Password",
    type: showPw ? 'text' : 'password',
    value: pw,
    onChange: e => setPw(e.target.value),
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    trailing: /*#__PURE__*/React.createElement("button", {
      onClick: () => setShowPw(v => !v),
      "aria-label": "Toggle password",
      style: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 4,
        display: 'flex',
        color: 'var(--fg-2)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "eye",
      size: 17
    }))
  }), /*#__PURE__*/React.createElement(PrimaryWideButton, {
    onClick: () => {}
  }, "Sign in")));
}
Object.assign(window, {
  LoginModal,
  ModalEmailForm
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/LoginModal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/NavBar.jsx
try { (() => {
// Dreamwall UI kit — top navigation bar
// Live search dropdown (poster + title + year + type) and a profile menu.
function SearchResult({
  film,
  onOpen
}) {
  const [hover, setHover] = React.useState(false);
  const t = window.AICDB_TYPES[film.type];
  return /*#__PURE__*/React.createElement("div", {
    onMouseDown: e => {
      e.preventDefault();
      onOpen(film);
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '8px 12px',
      cursor: 'pointer',
      background: hover ? 'var(--bg-2)' : 'transparent',
      borderRadius: 'var(--radius-md)',
      transition: 'background var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 52,
      flex: 'none',
      borderRadius: 6,
      overflow: 'hidden',
      background: `linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 150%)`,
      boxShadow: 'var(--shadow-1)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 13.5px/1.2 var(--font-body)',
      color: 'var(--fg-0)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, film.title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)',
      marginTop: 3
    }
  }, film.year)), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      font: '600 10px/1 var(--font-body)',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      color: t.text,
      background: t.ghost,
      padding: '4px 8px',
      borderRadius: 'var(--radius-pill)'
    }
  }, t.label));
}
function ProfileMenu({
  onNav,
  isCreator = true,
  isAdmin = true
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const close = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  const items = [{
    icon: 'user',
    label: 'Profile',
    action: () => {
      window.location.href = 'Dreamwall%20Profile.html';
    }
  }, {
    icon: 'film-slate',
    label: 'My Contents',
    action: () => {
      window.location.href = 'Dreamwall%20My%20Contents.html?manage=1';
    }
  }, {
    icon: 'plus-circle',
    label: 'Add Creator Account',
    action: () => {
      window.location.href = 'Dreamwall%20Add%20Creator%20Account.html';
    }
  }, {
    icon: 'chat-text',
    label: 'My Reviews',
    action: () => onNav && onNav('My Reviews')
  }, {
    icon: 'gear',
    label: 'Preferences',
    action: () => onNav && onNav('Preferences')
  }, {
    icon: 'sign-out',
    label: 'Log Out',
    action: () => {},
    danger: true
  }, isAdmin && {
    iconNode: /*#__PURE__*/React.createElement(ShieldNoldor, {
      size: 16
    }),
    label: 'Admin Panel',
    action: () => {
      window.location.href = 'Dreamwall%20Admin%20Panel.html';
    }
  }].filter(Boolean);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      position: 'relative',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => setOpen(o => !o),
    style: {
      cursor: 'pointer',
      display: 'flex',
      borderRadius: '50%',
      outline: open ? '2px solid var(--coral)' : '2px solid transparent',
      outlineOffset: 2,
      transition: 'outline-color var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    size: 30,
    colors: ['#d85a30', '#9d8df1']
  })), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 44,
      right: 0,
      width: 188,
      padding: 6,
      zIndex: 80,
      background: 'var(--bg-1)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 10px 10px',
      borderBottom: '1px solid var(--border-subtle)',
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 14px/1.2 var(--font-body)',
      color: 'var(--fg-0)'
    }
  }, "Ada Vance"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)',
      marginTop: 3
    }
  }, "@adavance")), items.map(it => /*#__PURE__*/React.createElement(MenuRow, {
    key: it.label,
    icon: it.icon,
    iconNode: it.iconNode,
    danger: it.danger,
    admin: it.admin,
    onClick: () => {
      setOpen(false);
      it.action();
    }
  }, it.label))));
}

// subtle shield carrying a Noldor (eight-pointed) star — understated, blends with text
function ShieldNoldor({
  size = 16,
  color = 'var(--fg-1)'
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    style: {
      display: 'block',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2.6 L19.2 5.2 V11 C19.2 15.6 16 18.9 12 20.4 C8 18.9 4.8 15.6 4.8 11 V5.2 Z",
    stroke: color,
    strokeWidth: "1.3",
    fill: "none",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: "12,7.2 12.55,9.25 14.55,8.3 13.45,10.2 15.6,10.8 13.45,11.4 14.55,13.3 12.55,12.35 12,14.4 11.45,12.35 9.45,13.3 10.55,11.4 8.4,10.8 10.55,10.2 9.45,8.3 11.45,9.25",
    fill: color
  }));
}
function MenuRow({
  icon,
  iconNode,
  children,
  onClick,
  danger,
  admin
}) {
  const [hover, setHover] = React.useState(false);
  const color = danger ? 'var(--score-low)' : admin ? 'var(--coral-bright)' : 'var(--fg-0)';
  const iconColor = danger ? 'var(--score-low)' : admin ? 'var(--coral-bright)' : 'var(--fg-1)';
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      padding: '9px 10px',
      cursor: 'pointer',
      borderRadius: 'var(--radius-md)',
      background: hover ? 'var(--bg-2)' : 'transparent',
      font: '500 13.5px/1 var(--font-body)',
      color,
      borderTop: admin ? '1px solid var(--border-subtle)' : 'none',
      marginTop: admin ? 4 : 0,
      paddingTop: admin ? 13 : 9,
      transition: 'background var(--dur-fast)'
    }
  }, iconNode ? iconNode : /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 16,
    color: iconColor,
    weight: admin ? 'fill' : 'regular'
  }), children, admin && /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-up-right",
    size: 13,
    color: "var(--fg-3)"
  }));
}
function NavLink({
  label,
  display,
  icon,
  bold,
  active,
  onNav
}) {
  const [hover, setHover] = React.useState(false);
  const text = display || label;
  const isPeople = label === 'Feed';
  const isSecondary = label === 'What is Dreamwall';
  const accent = isPeople ? 'var(--teal-bright)' : 'var(--coral)';
  // resting color: People leans teal, secondary stays muted grey, others neutral
  const restColor = isPeople ? 'var(--teal-bright)' : isSecondary ? 'var(--fg-2)' : 'var(--fg-1)';
  const color = active ? 'var(--fg-0)' : hover ? 'var(--fg-0)' : restColor;
  const weight = bold ? 600 : 500;
  const iconColor = active ? 'var(--fg-0)' : hover ? 'var(--fg-0)' : isPeople ? 'var(--teal-bright)' : 'var(--fg-1)';
  return /*#__PURE__*/React.createElement("a", {
    onClick: () => onNav && onNav(label),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      cursor: 'pointer',
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      font: isSecondary ? '500 13.5px/1 var(--font-body)' : `${weight} 14px/1 var(--font-body)`,
      color,
      paddingBottom: 5,
      borderBottom: active ? `2px solid ${accent}` : '2px solid transparent',
      transition: 'color var(--dur-fast)'
    }
  }, icon && /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 16,
    color: iconColor,
    weight: isPeople ? 'fill' : 'regular'
  }), text);
}
function NavBar({
  active = 'Feed',
  onNav,
  query,
  onQuery,
  onOpenResult,
  isCreator = true,
  isAdmin = true
}) {
  const primaryLinks = ['Discover', 'Films', 'Series', 'Creators'];
  const [focused, setFocused] = React.useState(false);
  const q = (query || '').trim().toLowerCase();
  const results = q ? window.AICDB_FILMS.filter(f => f.title.toLowerCase().includes(q) || f.creator.toLowerCase().includes(q) || f.genres.join(' ').toLowerCase().includes(q)).slice(0, 6) : [];
  const showDrop = focused && q.length > 0;
  const suggestion = !results.length && q.length >= 2 && window.aicdbSuggest ? window.aicdbSuggest(query) : null;
  const runSearch = term => {
    onQuery && onQuery(term);
  };
  return /*#__PURE__*/React.createElement("nav", {
    className: "aicdb-nav",
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      gap: 28,
      padding: '14px 28px',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    size: 20,
    onClick: () => onNav && onNav('Discover')
  }), /*#__PURE__*/React.createElement("div", {
    className: "aicdb-nav-primary",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 22
    }
  }, primaryLinks.map(l => /*#__PURE__*/React.createElement(NavLink, {
    key: l,
    label: l,
    active: active === l,
    onNav: onNav
  })), /*#__PURE__*/React.createElement("span", {
    className: "aicdb-nav-sec",
    style: {
      width: 1,
      height: 16,
      background: 'var(--border-default)',
      margin: '0 4px'
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "aicdb-nav-sec"
  }, /*#__PURE__*/React.createElement(NavLink, {
    label: "What is Dreamwall",
    active: active === 'What is Dreamwall',
    onNav: onNav
  }))), /*#__PURE__*/React.createElement("div", {
    className: "aicdb-nav-spacer",
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "aicdb-nav-search",
    style: {
      position: 'relative',
      width: 240
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: 'var(--bg-2)',
      border: '1px solid ' + (focused ? 'var(--border-accent)' : 'var(--border-subtle)'),
      borderRadius: showDrop ? '18px 18px 0 0' : 'var(--radius-pill)',
      padding: '7px 14px',
      transition: 'border-color var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 16,
    color: "var(--fg-2)"
  }), /*#__PURE__*/React.createElement("input", {
    value: query || '',
    onChange: e => {
      setFocused(true);
      onQuery && onQuery(e.target.value);
    },
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    placeholder: "Search titles, creators\u2026",
    style: {
      background: 'none',
      border: 'none',
      outline: 'none',
      color: 'var(--fg-0)',
      font: 'var(--text-body-sm)',
      width: '100%'
    }
  })), showDrop && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      zIndex: 60,
      padding: 6,
      background: 'var(--bg-1)',
      border: '1px solid var(--border-accent)',
      borderTop: 'none',
      borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
      boxShadow: 'var(--shadow-3)',
      maxHeight: 380,
      overflowY: 'auto'
    }
  }, results.length ? results.map(f => /*#__PURE__*/React.createElement(SearchResult, {
    key: f.id,
    film: f,
    onOpen: film => {
      onOpenResult && onOpenResult(film);
    }
  })) : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 14px 14px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "magnifying-glass",
    size: 22,
    color: "var(--fg-3)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 14px/1.3 var(--font-body)',
      color: 'var(--fg-0)',
      marginTop: 10
    }
  }, "No titles match \u201C", query, "\u201D"), suggestion ? /*#__PURE__*/React.createElement("div", {
    onMouseDown: e => {
      e.preventDefault();
      runSearch(suggestion);
    },
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      marginTop: 12,
      padding: '9px 14px',
      cursor: 'pointer',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--teal-ghost)',
      border: '1px solid rgba(78,205,196,0.4)',
      font: '600 13px/1 var(--font-body)',
      color: 'var(--teal-bright)'
    }
  }, "Did you mean ", /*#__PURE__*/React.createElement("span", {
    style: {
      textDecoration: 'underline'
    }
  }, suggestion), "?") : /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)',
      marginTop: 6
    }
  }, "Try a different title, creator, or genre.")))), /*#__PURE__*/React.createElement("div", {
    className: "aicdb-nav-right",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement(NavLink, {
    label: "Feed",
    display: "People",
    icon: "users",
    bold: true,
    active: active === 'Feed',
    onNav: onNav
  }), /*#__PURE__*/React.createElement(NavLink, {
    label: "Watchlist",
    display: "My Watchlist",
    icon: "bookmark",
    active: active === 'Watchlist',
    onNav: onNav
  }), /*#__PURE__*/React.createElement(ProfileMenu, {
    onNav: onNav,
    isCreator: isCreator,
    isAdmin: isAdmin
  })));
}
Object.assign(window, {
  NavBar,
  NavLink,
  ProfileMenu,
  SearchResult
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/NavBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/Preferences.jsx
try { (() => {
// Dreamwall UI kit — Preferences page.
// Language, Appearance (theme), Notifications, Privacy. Fully interactive,
// persisted to localStorage. Reuses Primitives (Icon) + design tokens.

// ---- persisted settings store ----
const PREFS_KEY = 'aicdb_prefs';
function loadPrefs() {
  const defaults = {
    lang: 'EN',
    theme: 'Cyberpunk',
    notif: {
      releases: true,
      replies: true,
      digest: false,
      milestones: true
    },
    privacy: {
      visibility: 'Public',
      showWatchlist: true,
      showActivity: true,
      showOnline: false
    }
  };
  try {
    const saved = JSON.parse(localStorage.getItem(PREFS_KEY) || '{}');
    // migrate legacy theme names
    if (saved.theme === 'Dark') saved.theme = 'Cyberpunk';
    if (saved.theme === 'Light') saved.theme = 'Solarpunk';
    return {
      ...defaults,
      ...saved,
      notif: {
        ...defaults.notif,
        ...(saved.notif || {})
      },
      privacy: {
        ...defaults.privacy,
        ...(saved.privacy || {})
      }
    };
  } catch (e) {
    return defaults;
  }
}
function savePrefs(p) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(p));
  } catch (e) {}
}

// ---- pill toggle switch ----
function Toggle({
  on,
  onChange
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => onChange(!on),
    role: "switch",
    "aria-checked": on,
    style: {
      width: 46,
      height: 26,
      flex: 'none',
      borderRadius: 'var(--radius-pill)',
      border: 'none',
      cursor: 'pointer',
      padding: 3,
      display: 'flex',
      alignItems: 'center',
      background: on ? 'var(--teal)' : 'var(--bg-3)',
      justifyContent: on ? 'flex-end' : 'flex-start',
      transition: 'background var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      borderRadius: '50%',
      background: on ? '#04201e' : 'var(--fg-2)',
      boxShadow: 'var(--shadow-1)',
      transition: 'background var(--dur-base)'
    }
  }));
}

// ---- segmented control (theme / visibility) ----
function Segmented({
  options,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      gap: 3,
      padding: 3,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--bg-0)',
      border: '1px solid var(--border-subtle)'
    }
  }, options.map(opt => {
    const on = value === opt.value;
    return /*#__PURE__*/React.createElement("button", {
      key: opt.value,
      onClick: () => onChange(opt.value),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '8px 16px',
        borderRadius: 'var(--radius-pill)',
        border: 'none',
        cursor: 'pointer',
        font: '600 13px/1 var(--font-body)',
        transition: 'all var(--dur-fast)',
        background: on ? 'var(--fg-0)' : 'transparent',
        color: on ? 'var(--bg-0)' : 'var(--fg-1)'
      }
    }, opt.icon && /*#__PURE__*/React.createElement(Icon, {
      name: opt.icon,
      size: 15,
      color: on ? 'var(--bg-0)' : 'var(--fg-2)'
    }), opt.label);
  }));
}

// ---- a single settings row inside a card ----
function PrefRow({
  title,
  desc,
  children,
  last
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "aicdb-pref-row",
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 24,
      padding: '18px 0',
      borderBottom: last ? 'none' : '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 14.5px/1.3 var(--font-body)',
      color: 'var(--fg-0)'
    }
  }, title), desc && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)',
      marginTop: 4
    }
  }, desc)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 'none'
    }
  }, children));
}

// ---- section: overline heading + card ----
function PrefSection({
  icon,
  title,
  sub,
  children
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      marginBottom: 36
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 'var(--radius-md)',
      flex: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-2)',
      border: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 17,
    color: "var(--coral-bright)",
    weight: "fill"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: '600 19px/1.1 var(--font-display)',
      color: 'var(--fg-0)',
      margin: 0
    }
  }, title), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)',
      marginTop: 3
    }
  }, sub))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 22px',
      background: 'var(--bg-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)'
    }
  }, children));
}

// ---- searchable language picker (26 languages) ----
function LanguagePicker({
  value,
  onChange
}) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState('');
  const ref = React.useRef(null);
  const langs = window.AICDB_LANGUAGES || [];
  const current = window.AICDB_LANG_BY_CODE ? window.AICDB_LANG_BY_CODE[value] : null;
  React.useEffect(() => {
    if (!open) return;
    const close = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setQ('');
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  const ql = q.trim().toLowerCase();
  const shown = ql ? langs.filter(l => l.name.toLowerCase().includes(ql) || l.native.toLowerCase().includes(ql) || l.code.toLowerCase().includes(ql)) : langs;
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      position: 'relative',
      width: 280
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(o => !o),
    style: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      padding: '11px 14px',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      background: 'var(--bg-0)',
      border: '1px solid ' + (open ? 'var(--border-accent)' : 'var(--border-default)'),
      color: 'var(--fg-0)',
      font: '600 14px/1 var(--font-body)',
      transition: 'border-color var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "globe",
    size: 16,
    color: "var(--fg-2)"
  }), current ? current.name : value, current && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 12px/1 var(--font-mono)',
      color: 'var(--fg-3)'
    }
  }, current.code)), /*#__PURE__*/React.createElement(Icon, {
    name: open ? 'caret-up' : 'caret-down',
    size: 12,
    color: "var(--fg-3)"
  })), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 'calc(100% + 8px)',
      left: 0,
      right: 0,
      zIndex: 70,
      background: 'var(--bg-1)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-3)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 8,
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 11px',
      background: 'var(--bg-0)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "magnifying-glass",
    size: 14,
    color: "var(--fg-3)"
  }), /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Search languages\u2026",
    style: {
      flex: 1,
      background: 'none',
      border: 'none',
      outline: 'none',
      color: 'var(--fg-0)',
      font: 'var(--text-body-sm)'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: 280,
      overflowY: 'auto',
      padding: 6
    }
  }, shown.length ? shown.map(l => {
    const on = l.code === value;
    return /*#__PURE__*/React.createElement("div", {
      key: l.code,
      onClick: () => {
        onChange(l.code);
        setOpen(false);
        setQ('');
      },
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '10px 11px',
        cursor: 'pointer',
        borderRadius: 'var(--radius-md)',
        background: on ? 'var(--bg-2)' : 'transparent'
      },
      onMouseEnter: e => {
        if (!on) e.currentTarget.style.background = 'var(--bg-2)';
      },
      onMouseLeave: e => {
        if (!on) e.currentTarget.style.background = 'transparent';
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 13.5px/1.2 var(--font-body)',
        color: 'var(--fg-0)'
      }
    }, l.name), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--text-body-sm)',
        color: 'var(--fg-2)',
        marginLeft: 8
      }
    }, l.native)), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 9,
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '500 11px/1 var(--font-mono)',
        color: 'var(--fg-3)'
      }
    }, l.code), on && /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 14,
      color: "var(--teal-bright)"
    })));
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 12px',
      textAlign: 'center',
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)'
    }
  }, "No languages match \u201C", q, "\u201D."))));
}

// ---- the page ----
function Preferences() {
  const [prefs, setPrefs] = React.useState(loadPrefs);
  const [saved, setSaved] = React.useState(false);
  const set = patch => setPrefs(p => ({
    ...p,
    ...patch
  }));
  const setNotif = (k, v) => setPrefs(p => ({
    ...p,
    notif: {
      ...p.notif,
      [k]: v
    }
  }));
  const setPrivacy = (k, v) => setPrefs(p => ({
    ...p,
    privacy: {
      ...p.privacy,
      [k]: v
    }
  }));
  React.useEffect(() => {
    savePrefs(prefs);
    setSaved(true);
    const t = setTimeout(() => setSaved(false), 1600);
    return () => clearTimeout(t);
  }, [prefs]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 760,
      margin: '0 auto',
      padding: '40px 28px 90px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 20,
      marginBottom: 34,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--text-h1)',
      color: 'var(--fg-0)',
      letterSpacing: '-0.015em',
      margin: 0
    }
  }, "Preferences"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body)',
      color: 'var(--fg-2)',
      margin: '8px 0 0'
    }
  }, "Manage your language, appearance, and privacy.")), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      font: '600 12.5px/1 var(--font-body)',
      color: saved ? 'var(--teal-bright)' : 'var(--fg-3)',
      transition: 'color var(--dur-base)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: saved ? 'check-circle' : 'cloud-check',
    size: 15,
    color: saved ? 'var(--teal-bright)' : 'var(--fg-3)',
    weight: "fill"
  }), saved ? 'Saved' : 'All changes saved')), /*#__PURE__*/React.createElement(PrefSection, {
    icon: "globe",
    title: "Language & Region",
    sub: "Choose the language for the Dreamwall interface."
  }, /*#__PURE__*/React.createElement(PrefRow, {
    title: "Display language",
    desc: "Applies across the catalog, reviews, and your profile.",
    last: true
  }, /*#__PURE__*/React.createElement(LanguagePicker, {
    value: prefs.lang,
    onChange: c => set({
      lang: c
    })
  }))), /*#__PURE__*/React.createElement(PrefSection, {
    icon: "palette",
    title: "Appearance",
    sub: "Tune how Dreamwall looks on this device."
  }, /*#__PURE__*/React.createElement(PrefRow, {
    title: "Theme",
    desc: "Cyberpunk is the midnight-cinema look; Solarpunk is a sunlit greenhouse \u2014 sage, terracotta, and viridian.",
    last: true
  }, /*#__PURE__*/React.createElement(Segmented, {
    value: prefs.theme,
    onChange: v => {
      set({
        theme: v
      });
      if (window.AICDB_applyTheme) window.AICDB_applyTheme(v);
    },
    options: [{
      value: 'Cyberpunk',
      label: 'Cyberpunk',
      icon: 'moon-stars'
    }, {
      value: 'Solarpunk',
      label: 'Solarpunk',
      icon: 'sun'
    }, {
      value: 'System',
      label: 'System',
      icon: 'desktop'
    }]
  }))), /*#__PURE__*/React.createElement(PrefSection, {
    icon: "lock-key",
    title: "Privacy",
    sub: "Control who sees your activity."
  }, /*#__PURE__*/React.createElement(PrefRow, {
    title: "Show watchlist on profile",
    desc: "Let visitors see the titles you've queued.",
    last: true
  }, /*#__PURE__*/React.createElement(Toggle, {
    on: prefs.privacy.showWatchlist,
    onChange: v => setPrivacy('showWatchlist', v)
  }))));
}
Object.assign(window, {
  Preferences,
  PrefToggle: Toggle,
  PrefSegmented: Segmented,
  LanguagePicker
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/Preferences.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/Primitives.jsx
try { (() => {
// Dreamwall UI kit — shared primitives
// Icon: Phosphor icon font (loaded in index.html). name maps to a Phosphor glyph.
// weight: 'fill' | 'bold' | 'regular' | 'duotone'. Passing fill=true forces fill weight.
const PH = {
  star: 'star',
  bookmark: 'bookmark-simple',
  play: 'play',
  search: 'magnifying-glass',
  sparkles: 'sparkle',
  film: 'film-slate',
  tv: 'television-simple',
  smartphone: 'device-mobile',
  clapperboard: 'film-slate',
  'message-square': 'chat-centered-text',
  'share-2': 'share-network',
  list: 'list-bullets',
  plus: 'plus',
  'chevron-left': 'caret-left',
  check: 'check',
  clock: 'clock',
  heart: 'heart',
  eye: 'eye',
  fire: 'fire',
  trophy: 'trophy',
  mail: 'envelope-simple',
  x: 'x'
};
function Icon({
  name,
  size = 20,
  color = 'currentColor',
  weight = 'bold',
  fill,
  style
}) {
  const w = fill && fill !== 'none' ? 'fill' : weight;
  return /*#__PURE__*/React.createElement("i", {
    className: `ph-${w} ph-${PH[name] || name}`,
    style: {
      fontSize: size,
      lineHeight: 1,
      color,
      display: 'block',
      flex: 'none',
      ...style
    }
  });
}
function Logo({
  size = 22,
  onClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: size * 0.5,
      cursor: onClick ? 'pointer' : 'default'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: window.__resources && window.__resources.aicdbMark || "../../assets/aicdb-mark.png",
    width: size * 1.55,
    height: size * 1.55,
    style: {
      display: 'block',
      filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))'
    },
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: `800 ${size}px/0.9 var(--font-display)`,
      letterSpacing: '-0.02em',
      color: 'var(--fg-0)'
    }
  }, "Dream", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--coral)'
    }
  }, "wall")));
}
function Button({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  onClick,
  active
}) {
  const pad = size === 'sm' ? '7px 13px' : size === 'lg' ? '13px 22px' : '11px 18px';
  const fs = size === 'sm' ? 13 : size === 'lg' ? 15 : 14;
  const base = {
    font: `600 ${fs}px/1 var(--font-body)`,
    borderRadius: 'var(--radius-md)',
    padding: pad,
    border: '1px solid transparent',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    transition: 'all var(--dur-fast) var(--ease-out)',
    whiteSpace: 'nowrap'
  };
  const variants = {
    primary: {
      background: 'var(--coral)',
      color: 'var(--fg-on-accent)'
    },
    teal: {
      background: active ? 'var(--teal)' : 'var(--teal-ghost)',
      color: active ? '#04201e' : 'var(--teal-bright)',
      border: active ? '1px solid transparent' : '1px solid rgba(78,205,196,0.4)'
    },
    secondary: {
      background: 'transparent',
      color: 'var(--fg-0)',
      borderColor: 'var(--border-strong)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--fg-1)'
    }
  };
  const [hover, setHover] = React.useState(false);
  const hoverStyle = hover ? variant === 'primary' ? {
    background: 'var(--coral-bright)'
  } : variant === 'secondary' ? {
    background: 'var(--bg-2)',
    borderColor: 'var(--border-strong)'
  } : variant === 'ghost' ? {
    color: 'var(--fg-0)'
  } : {} : {};
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      ...base,
      ...variants[variant],
      ...hoverStyle
    }
  }, icon && /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: fs + 2,
    fill: variant === 'primary' && icon === 'star' ? 'currentColor' : 'none'
  }), children);
}
function ContentBadge({
  type,
  solid = false,
  size = 'md'
}) {
  const t = window.AICDB_TYPES[type];
  if (!t) return null;
  const fs = size === 'sm' ? 10 : 12;
  const pad = size === 'sm' ? '3px 8px' : '6px 12px';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: pad,
      borderRadius: 'var(--radius-pill)',
      font: `600 ${fs}px/1 var(--font-body)`,
      letterSpacing: '0.04em',
      background: solid ? t.color : t.ghost,
      color: solid ? type === 'movie' ? '#1a0d08' : type === 'series' ? '#04201e' : type === 'short' ? '#2a1f00' : '#160a3a' : t.text
    }
  }, !solid && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: t.color
    }
  }), t.label.toUpperCase());
}
function StarRating({
  value = 0,
  interactive = false,
  onChange,
  size = 18
}) {
  const [hover, setHover] = React.useState(null);
  const display = hover != null ? hover : value;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      gap: 3
    },
    onMouseLeave: () => setHover(null)
  }, [1, 2, 3, 4, 5].map(i => {
    const fillPct = Math.max(0, Math.min(1, display - (i - 1))) * 100;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        position: 'relative',
        cursor: interactive ? 'pointer' : 'default',
        width: size,
        height: size
      },
      onMouseMove: interactive ? e => {
        const half = e.nativeEvent.offsetX < size / 2;
        setHover(i - (half ? 0.5 : 0));
      } : undefined,
      onClick: interactive ? () => onChange && onChange(hover) : undefined
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        color: 'var(--rating-track)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "star",
      size: size,
      fill: "currentColor",
      stroke: 0
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        width: `${fillPct}%`,
        overflow: 'hidden',
        color: 'var(--coral)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "star",
      size: size,
      fill: "currentColor",
      stroke: 0
    })));
  }));
}
function scoreColor(s) {
  return s >= 8 ? 'var(--score-high)' : s >= 5 ? 'var(--score-mid)' : 'var(--score-low)';
}

// Score + rating count, e.g. "8.4 · 1.2k". countColor adapts to light/dark contexts.
function ScoreLine({
  film,
  size = 22,
  countColor = 'var(--fg-2)',
  gap = 6
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'baseline',
      gap
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: `700 ${size}px/1 var(--font-mono)`,
      color: scoreColor(film.score)
    }
  }, film.score.toFixed(1)), /*#__PURE__*/React.createElement("span", {
    style: {
      font: `500 ${Math.max(10, Math.round(size * 0.5))}px/1 var(--font-mono)`,
      color: countColor
    }
  }, "\xB7 ", film.ratings));
}

// Editorial / auto content ribbon: "Staff Pick" or "Hidden Gem".
function ContentRibbon({
  film,
  size = 'md'
}) {
  const kind = window.AICDB_RIBBON ? window.AICDB_RIBBON(film) : null;
  if (!kind) return null;
  const cfg = kind === 'staff' ? {
    label: 'Staff Pick',
    icon: 'medal',
    fg: '#1a0d08',
    bg: 'var(--coral)'
  } : {
    label: 'Hidden Gem',
    icon: 'diamond',
    fg: '#04201e',
    bg: 'var(--teal)'
  };
  const fs = size === 'sm' ? 10 : 11;
  const pad = size === 'sm' ? '4px 8px' : '5px 10px';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: pad,
      borderRadius: 'var(--radius-pill)',
      background: cfg.bg,
      color: cfg.fg,
      font: `700 ${fs}px/1 var(--font-body)`,
      letterSpacing: '0.02em',
      boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: cfg.icon,
    size: fs + 2,
    color: cfg.fg,
    weight: "fill"
  }), cfg.label);
}

// Compact count label: 1.2k / 3.4M
function fmtCount(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(Math.round(n));
}

// Compact duration label for poster hover: 45m / 1h30m / S (series).
function formatDuration(film) {
  if (film.type === 'series') return 'S';
  const m = parseInt(String(film.runtime).replace(/[^0-9]/g, ''), 10);
  if (!m) return '—';
  if (m < 60) return m + 'm';
  const h = Math.floor(m / 60),
    rem = m % 60;
  return rem ? `${h}h${rem}m` : `${h}h`;
}

// Subscribe to the shared watchlist store.
function useWatchlist() {
  const [ids, setIds] = React.useState(window.AICDB_WATCHLIST.get());
  React.useEffect(() => window.AICDB_WATCHLIST.subscribe(setIds), []);
  return ids;
}

// Subscribe to the shared creator-accounts store.
function useCreatorAccounts() {
  const [list, setList] = React.useState(window.AICDB_CREATOR_ACCOUNTS.get());
  React.useEffect(() => window.AICDB_CREATOR_ACCOUNTS.subscribe(setList), []);
  return list;
}
function ScoreRing({
  score = 0,
  size = 78
}) {
  const pct = score / 10 * 100;
  const col = score >= 8 ? '#4ecdc4' : score >= 5 ? '#e5b23b' : '#e5484d';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      background: `conic-gradient(${col} 0 ${pct}%, var(--rating-track) ${pct}% 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: size - 16,
      height: size - 16,
      borderRadius: '50%',
      background: 'var(--bg-0)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: `700 ${size * 0.3}px/1 var(--font-mono)`,
      color: 'var(--fg-0)'
    }
  }, score.toFixed(1)), /*#__PURE__*/React.createElement("span", {
    style: {
      font: `500 ${size * 0.115}px/1 var(--font-mono)`,
      color: 'var(--fg-2)',
      letterSpacing: '0.05em',
      marginTop: 2
    }
  }, "SCORE")));
}
function Avatar({
  colors = ['#d85a30', '#4ecdc4'],
  size = 30
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      flex: 'none',
      background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`
    }
  });
}
Object.assign(window, {
  Icon,
  Logo,
  Button,
  ContentBadge,
  StarRating,
  ScoreRing,
  Avatar,
  scoreColor,
  ScoreLine,
  ContentRibbon,
  formatDuration,
  useWatchlist,
  useCreatorAccounts,
  fmtCount
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/Primitives.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/Profile.jsx
try { (() => {
// Dreamwall UI kit — User profile page
// Dark cinematic. Reuses Primitives (Icon, Button, Avatar, StarRating, ScoreRing,
// ContentBadge, scoreColor), NavBar, FilmCard, and AICDB_FILMS / AICDB_TYPES.

const PROFILE = {
  name: 'Ada Vance',
  initials: 'A',
  joined: 'Joined March 2024',
  quote: 'Chasing the one frame that remembers me.',
  avatar: ['#d85a30', '#9d8df1'],
  watched: 852,
  lists: 10,
  avgRating: 4.2,
  hours: 1284,
  reviews: 96,
  thisYear: 218,
  favGenre: 'Sci-Fi',
  favGenreShare: '38% of everything you watch'
};

// films keyed by id for convenience
function filmsById() {
  const m = {};
  window.AICDB_FILMS.forEach(f => {
    m[f.id] = f;
  });
  return m;
}
const LAST_RATED = [{
  id: 'echoes-of-tomorrow',
  you: 5,
  date: '2026-05-31'
}, {
  id: 'synthetic-dreams',
  you: 4.5,
  date: '2026-05-28'
}, {
  id: 'glass-orchard',
  you: 4,
  date: '2026-05-22'
}, {
  id: 'the-long-render',
  you: 3.5,
  date: '2026-05-14'
}, {
  id: 'minute-of-static',
  you: 4,
  date: '2026-05-09'
}, {
  id: 'paper-suns',
  you: 4.5,
  date: '2026-04-30'
}];

// the full rating history (built from the catalog) for the "See all" page.
// Deterministic pseudo user-scores + dates so the same titles always read the same.
function allRatedEntries() {
  const seeded = {};
  LAST_RATED.forEach(r => {
    seeded[r.id] = r;
  });
  const films = window.AICDB_FILMS || [];
  const out = [];
  let day = 0;
  films.forEach((f, i) => {
    if (seeded[f.id]) {
      out.push({
        ...seeded[f.id],
        film: f
      });
      return;
    }
    // derive a stable half-star score near the title's own AI score
    const base = Math.round(f.score / 2 * 2) / 2;
    const you = Math.max(1, Math.min(5, base + (i % 3 - 1) * 0.5));
    day += 9 + i % 4 * 5;
    const d = new Date(2026, 3, 28);
    d.setDate(d.getDate() - day);
    out.push({
      id: f.id,
      you,
      date: d.toISOString().slice(0, 10),
      film: f
    });
  });
  // newest first
  return out.sort((a, b) => a.date < b.date ? 1 : -1);
}
function fmtRatedDate(iso) {
  try {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (e) {
    return iso;
  }
}
const FAVORITES = ['synthetic-dreams', 'echoes-of-tomorrow', 'glass-orchard', 'the-long-render', 'paper-suns'];

// user-created lists (title + how many titles each holds)
const CREATED_LISTS = [{
  id: 'l1',
  title: 'Best of Diffusion',
  count: 24,
  note: 'The generative films that still hold up'
}, {
  id: 'l2',
  title: '3AM Static',
  count: 12,
  note: 'Vertical horror for the doomscroll'
}, {
  id: 'l3',
  title: 'Latent Epics',
  count: 9,
  note: 'Generation-spanning, world-sized stories'
}, {
  id: 'l4',
  title: 'Wordless',
  count: 15,
  note: 'No dialogue, all light'
}, {
  id: 'l5',
  title: 'Hybrid Live-Action',
  count: 18,
  note: 'Where cameras meet the model'
}, {
  id: 'l6',
  title: 'Comfort Renders',
  count: 7,
  note: 'Rewatchable, low-stakes, warm'
}, {
  id: 'l7',
  title: 'Coastlines',
  count: 6,
  note: 'Films that drown you beautifully'
}, {
  id: 'l8',
  title: 'Festival Circuit',
  count: 11,
  note: 'What the juries are arguing about'
}, {
  id: 'l9',
  title: 'Shorts Under 10',
  count: 21,
  note: 'Quick hits worth your lunch break'
}, {
  id: 'l10',
  title: 'The Uncanny Shelf',
  count: 8,
  note: 'Titles that learned to look back'
}];
const BADGES = [{
  icon: 'trophy',
  label: '1,000 Rated',
  sub: 'Titles rated',
  color: 'var(--coral-bright)',
  ghost: 'rgba(216,90,48,0.18)'
}, {
  icon: 'fire',
  label: '47-Day Streak',
  sub: 'Daily ratings',
  color: 'var(--type-short)',
  ghost: 'rgba(229,178,59,0.16)'
}, {
  icon: 'medal',
  label: 'Top Reviewer',
  sub: 'Top 1% this month',
  color: 'var(--teal-bright)',
  ghost: 'rgba(78,205,196,0.16)'
}, {
  icon: 'film-slate',
  label: 'Cinephile',
  sub: '500 films watched',
  color: 'var(--type-vertical)',
  ghost: 'rgba(157,141,241,0.18)'
}, {
  icon: 'star',
  label: 'Tastemaker',
  sub: '200 helpful votes',
  color: 'var(--coral-bright)',
  ghost: 'rgba(216,90,48,0.18)'
}, {
  icon: 'sparkles',
  label: 'Early Adopter',
  sub: 'Joined in 2024',
  color: 'var(--teal-bright)',
  ghost: 'rgba(78,205,196,0.16)'
}];

// ---- Section heading (centered or left) ----
function SectionHeading({
  children,
  align = 'left',
  sub
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: align,
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--text-h2)',
      color: 'var(--fg-0)',
      letterSpacing: '-0.01em'
    }
  }, children), sub && /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)',
      margin: '6px 0 0'
    }
  }, sub));
}

// ---- TOP: profile / watched / lists ----
function TopSection() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginBottom: 60
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 200,
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      background: 'linear-gradient(120deg, #2a1410 0%, #241a3a 50%, #10302d 120%)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(70% 120% at 18% 0%, rgba(216,90,48,0.28), transparent 55%),' + 'radial-gradient(60% 120% at 82% 10%, rgba(78,205,196,0.20), transparent 55%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      opacity: 0.5,
      backgroundImage: 'radial-gradient(rgba(245,243,239,0.05) 1px, transparent 1px)',
      backgroundSize: '5px 5px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to bottom, rgba(10,10,10,0.05), var(--bg-0) 96%)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "aicdb-profile-top",
    style: {
      position: 'relative',
      margin: '-72px 20px 0',
      padding: '0 8px',
      display: 'grid',
      gridTemplateColumns: '1.15fr 1fr 1fr',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: '0 28px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 128,
      height: 128,
      borderRadius: '50%',
      flex: 'none',
      position: 'relative',
      background: `linear-gradient(135deg, ${PROFILE.avatar[0]}, ${PROFILE.avatar[1]})`,
      border: '4px solid var(--bg-0)',
      boxShadow: 'var(--shadow-3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 56px/1 var(--font-display)',
      color: 'rgba(255,255,255,0.92)'
    }
  }, PROFILE.initials), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: '50%',
      boxShadow: 'inset 0 2px 18px rgba(255,255,255,0.25), inset 0 -10px 24px rgba(0,0,0,0.35)'
    }
  })), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: '700 30px/1.1 var(--font-display)',
      letterSpacing: '-0.015em',
      color: 'var(--fg-0)',
      margin: '18px 0 0'
    }
  }, PROFILE.name), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)',
      marginTop: 8,
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 13,
    color: "var(--fg-3)"
  }), PROFILE.joined), /*#__PURE__*/React.createElement("p", {
    style: {
      font: '400 italic 15px/1.45 var(--font-display)',
      color: 'var(--fg-1)',
      fontStyle: 'italic',
      margin: '14px 0 0',
      maxWidth: 260,
      borderLeft: '2px solid var(--coral-dim)',
      paddingLeft: 12
    }
  }, "\u201C", PROFILE.quote, "\u201D")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      paddingTop: 72,
      borderLeft: '1px solid var(--border-subtle)',
      borderRight: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 72px/0.95 var(--font-mono)',
      color: 'var(--fg-0)',
      letterSpacing: '-0.02em'
    }
  }, PROFILE.watched.toLocaleString()), /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      marginTop: 12,
      color: 'var(--fg-1)'
    }
  }, "Titles watched")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      paddingTop: 36,
      width: '100%',
      maxWidth: 240,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  }, /*#__PURE__*/React.createElement(FollowingBox, null), /*#__PURE__*/React.createElement(CreatedListsBox, null))));
}

// ---- MIDDLE: last rated posters ----
function RatedPoster({
  film,
  you
}) {
  const [hover, setHover] = React.useState(false);
  const aspect = film.type === 'vertical' ? '9/16' : '2/3';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 164,
      flex: 'none'
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: aspect,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      position: 'relative',
      background: `linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 150%)`,
      boxShadow: 'var(--shadow-poster)',
      transition: 'transform var(--dur-base) var(--ease-out), filter var(--dur-base) var(--ease-out)',
      transform: hover ? 'translateY(-3px) scale(1.015)' : 'none',
      filter: hover ? 'brightness(1.08)' : 'brightness(1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 9,
      left: 9
    }
  }, /*#__PURE__*/React.createElement(ContentRibbon, {
    film: film,
    size: "sm"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      padding: '26px 11px 11px',
      background: 'linear-gradient(to top, rgba(0,0,0,0.9) 8%, rgba(0,0,0,0) 100%)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(ScoreLine, {
    film: film,
    size: 19,
    countColor: "rgba(255,255,255,0.7)",
    gap: 4
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      background: 'var(--coral)',
      padding: '5px 8px',
      borderRadius: 'var(--radius-pill)',
      boxShadow: 'var(--shadow-1)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "star",
    size: 11,
    fill: "#1a0d08",
    color: "#1a0d08"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 12px/1 var(--font-mono)',
      color: '#1a0d08'
    }
  }, you.toFixed(1))))), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 13.5px/1.25 var(--font-body)',
      color: 'var(--fg-0)',
      marginTop: 9
    }
  }, film.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginTop: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)'
    }
  }, film.year), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-3)'
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)'
    }
  }, "You rated ", you.toFixed(1))));
}

// ---- a single row in the Last Rated vertical list ----
function LastRatedRow({
  entry,
  onOpen
}) {
  const [hover, setHover] = React.useState(false);
  const film = entry.film;
  const t = window.AICDB_TYPES[film.type];
  const aspect = film.type === 'vertical' ? '9/16' : '2/3';
  return /*#__PURE__*/React.createElement("div", {
    onClick: () => onOpen && onOpen(film),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '10px 12px',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      background: hover ? 'var(--bg-2)' : 'transparent',
      border: '1px solid ' + (hover ? 'var(--border-subtle)' : 'transparent'),
      transition: 'background var(--dur-fast), border-color var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 42,
      flex: 'none',
      aspectRatio: aspect,
      borderRadius: 'var(--radius-sm)',
      overflow: 'hidden',
      background: `linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 150%)`,
      boxShadow: 'var(--shadow-1)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 15px/1.25 var(--font-body)',
      color: 'var(--fg-0)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, film.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      marginTop: 4,
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)'
    }
  }, /*#__PURE__*/React.createElement("span", null, film.year), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-3)'
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: t.text
    }
  }, t.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      flex: 'none',
      background: 'var(--coral)',
      padding: '5px 9px',
      borderRadius: 'var(--radius-pill)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "star",
    size: 11,
    fill: "#1a0d08",
    color: "#1a0d08"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 12px/1 var(--font-mono)',
      color: '#1a0d08'
    }
  }, entry.you.toFixed(1))));
}
function LastRated({
  onOpen,
  onSeeAll
}) {
  const byId = filmsById();
  const rated = LAST_RATED.map(r => ({
    ...r,
    film: byId[r.id]
  })).filter(r => r.film).slice(0, 5);
  const favFilms = FAVORITES.map(id => byId[id]).filter(Boolean);
  return /*#__PURE__*/React.createElement("section", {
    className: "aicdb-profile-rated",
    style: {
      marginBottom: 64,
      display: 'grid',
      gridTemplateColumns: '1fr 1.15fr',
      gap: 48
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRight: '1px solid var(--border-subtle)',
      paddingRight: 48
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      font: 'var(--text-h3)',
      color: 'var(--fg-0)',
      marginBottom: 6
    }
  }, "Last Rated"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)',
      margin: '0 0 16px'
    }
  }, "The titles you most recently scored"), rated.length ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, rated.map(r => /*#__PURE__*/React.createElement(LastRatedRow, {
    key: r.id,
    entry: r,
    onOpen: onOpen
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => onSeeAll && onSeeAll(),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      marginTop: 14,
      padding: '8px 14px',
      cursor: 'pointer',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--bg-2)',
      border: '1px solid var(--border-default)',
      color: 'var(--fg-1)',
      font: '600 12.5px/1 var(--font-body)',
      transition: 'all var(--dur-fast)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = 'var(--border-accent)';
      e.currentTarget.style.color = 'var(--coral)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = 'var(--border-default)';
      e.currentTarget.style.color = 'var(--fg-1)';
    }
  }, "See all ratings ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 13,
    color: "currentColor"
  }))) : /*#__PURE__*/React.createElement(EmptyState, {
    icon: "star",
    accent: "var(--coral)",
    compact: true,
    title: "You haven\u2019t rated anything yet",
    sub: "Score a few titles and they\u2019ll show up here \u2014 your taste, on the record.",
    actionLabel: "Browse the catalog",
    onAction: () => onOpen && onOpen(null)
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      font: 'var(--text-h3)',
      color: 'var(--fg-0)',
      marginBottom: 6
    }
  }, "Favorites"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)',
      margin: '0 0 16px'
    }
  }, "The five you\u2019d save from the fire"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      overflowX: 'auto',
      paddingBottom: 8,
      scrollbarWidth: 'thin'
    }
  }, favFilms.map(f => /*#__PURE__*/React.createElement("div", {
    key: f.id,
    style: {
      width: 128,
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(FilmCard, {
    film: f,
    width: "auto",
    onOpen: onOpen || (() => {})
  }))))));
}

// ---- full page: every rating, with type + sort filters ----
function AllRatingsPage({
  onBack,
  onOpen
}) {
  const all = React.useMemo(() => allRatedEntries(), []);
  const [type, setType] = React.useState('all');
  const [sort, setSort] = React.useState('recent');
  const types = [{
    id: 'all',
    label: 'All'
  }, {
    id: 'movie',
    label: 'Movies'
  }, {
    id: 'series',
    label: 'Series'
  }, {
    id: 'short',
    label: 'Shorts'
  }, {
    id: 'vertical',
    label: 'Vertical'
  }];
  const sorts = [{
    id: 'recent',
    label: 'Most recent'
  }, {
    id: 'oldest',
    label: 'Oldest'
  }, {
    id: 'highest',
    label: 'Highest rated'
  }, {
    id: 'lowest',
    label: 'Lowest rated'
  }, {
    id: 'title',
    label: 'Title A–Z'
  }];
  let rows = all.filter(r => type === 'all' || r.film.type === type);
  rows = rows.slice().sort((a, b) => {
    if (sort === 'recent') return a.date < b.date ? 1 : -1;
    if (sort === 'oldest') return a.date > b.date ? 1 : -1;
    if (sort === 'highest') return b.you - a.you || (a.date < b.date ? 1 : -1);
    if (sort === 'lowest') return a.you - b.you || (a.date < b.date ? 1 : -1);
    if (sort === 'title') return a.film.title.localeCompare(b.film.title);
    return 0;
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 860,
      margin: '0 auto',
      padding: '28px 28px 90px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      marginBottom: 18,
      padding: '8px 14px',
      cursor: 'pointer',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--bg-1)',
      border: '1px solid var(--border-default)',
      color: 'var(--fg-1)',
      font: '600 13px/1 var(--font-body)',
      transition: 'all var(--dur-fast)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.color = 'var(--fg-0)';
      e.currentTarget.style.borderColor = 'var(--border-strong)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.color = 'var(--fg-1)';
      e.currentTarget.style.borderColor = 'var(--border-default)';
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "caret-left",
    size: 14,
    color: "currentColor"
  }), " Back to profile"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--text-h1)',
      color: 'var(--fg-0)',
      letterSpacing: '-0.015em',
      marginBottom: 8
    }
  }, "All ratings"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body)',
      color: 'var(--fg-2)'
    }
  }, rows.length, " ", rows.length === 1 ? 'title' : 'titles', " you\u2019ve scored")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      flexWrap: 'wrap',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, types.map(o => {
    const on = type === o.id;
    return /*#__PURE__*/React.createElement("button", {
      key: o.id,
      onClick: () => setType(o.id),
      style: {
        padding: '8px 14px',
        cursor: 'pointer',
        borderRadius: 'var(--radius-pill)',
        font: '600 12.5px/1 var(--font-body)',
        border: '1px solid ' + (on ? 'transparent' : 'var(--border-default)'),
        background: on ? 'var(--coral)' : 'var(--bg-1)',
        color: on ? 'var(--fg-on-accent)' : 'var(--fg-1)',
        transition: 'all var(--dur-fast)'
      }
    }, o.label);
  })), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 9,
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "funnel",
    size: 14,
    color: "var(--fg-2)",
    weight: "fill"
  }), /*#__PURE__*/React.createElement("select", {
    value: sort,
    onChange: e => setSort(e.target.value),
    style: {
      font: '600 13px/1 var(--font-body)',
      color: 'var(--fg-0)',
      background: 'var(--bg-1)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      padding: '9px 12px',
      cursor: 'pointer',
      outline: 'none'
    }
  }, sorts.map(s => /*#__PURE__*/React.createElement("option", {
    key: s.id,
    value: s.id,
    style: {
      background: 'var(--bg-1)'
    }
  }, s.label))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, rows.map(r => {
    const film = r.film;
    const t = window.AICDB_TYPES[film.type];
    const aspect = film.type === 'vertical' ? '9/16' : '2/3';
    return /*#__PURE__*/React.createElement("div", {
      key: r.id,
      onClick: () => onOpen && onOpen(film),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '12px 16px',
        cursor: 'pointer',
        background: 'var(--bg-1)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        transition: 'border-color var(--dur-fast)'
      },
      onMouseEnter: e => {
        e.currentTarget.style.borderColor = 'var(--border-default)';
      },
      onMouseLeave: e => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 46,
        flex: 'none',
        aspectRatio: aspect,
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        background: `linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 150%)`,
        boxShadow: 'var(--shadow-1)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0,
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 16px/1.2 var(--font-display)',
        color: 'var(--fg-0)'
      }
    }, film.title), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 9px/1 var(--font-body)',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        color: t.text,
        background: t.ghost,
        padding: '4px 8px',
        borderRadius: 'var(--radius-pill)'
      }
    }, t.label)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginTop: 5,
        font: 'var(--text-data-sm)',
        color: 'var(--fg-2)'
      }
    }, /*#__PURE__*/React.createElement("span", null, film.year), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--fg-3)'
      }
    }, "\xB7"), /*#__PURE__*/React.createElement("span", null, "Rated ", fmtRatedDate(r.date)))), /*#__PURE__*/React.createElement(StarRating, {
      value: r.you,
      size: 15
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        background: 'var(--coral)',
        padding: '5px 9px',
        borderRadius: 'var(--radius-pill)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "star",
      size: 11,
      fill: "#1a0d08",
      color: "#1a0d08"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '700 12px/1 var(--font-mono)',
        color: '#1a0d08'
      }
    }, r.you.toFixed(1))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 'none',
        width: 42,
        textAlign: 'right'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '700 18px/1 var(--font-mono)',
        color: scoreColor(film.score)
      }
    }, film.score.toFixed(1)), /*#__PURE__*/React.createElement("div", {
      className: "overline",
      style: {
        color: 'var(--fg-3)',
        marginTop: 4
      }
    }, "AI")));
  })));
}

// ---- LOWER: badges | favorites ----
function BadgeItem({
  b
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 54,
      height: 54,
      borderRadius: '50%',
      flex: 'none',
      background: b.ghost,
      border: `1px solid ${b.color}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: b.icon,
    size: 24,
    color: b.color,
    weight: "fill"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 15px/1.2 var(--font-body)',
      color: 'var(--fg-0)'
    }
  }, b.label), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)',
      marginTop: 3
    }
  }, b.sub)));
}
function LowerSection() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      marginBottom: 64
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      font: 'var(--text-h3)',
      color: 'var(--fg-0)',
      marginBottom: 24,
      textAlign: 'center'
    }
  }, "Achievements"), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 680,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      rowGap: 24,
      columnGap: 40
    }
  }, BADGES.map(b => /*#__PURE__*/React.createElement(BadgeItem, {
    key: b.label,
    b: b
  }))));
}

// ---- BOTTOM: statistics ----
function StatCard({
  icon,
  color,
  value,
  unit,
  label
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 22px',
      background: 'var(--bg-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: 128
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 20,
    color: color,
    weight: "fill"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 34px/1 var(--font-mono)',
      color: 'var(--fg-0)',
      letterSpacing: '-0.02em'
    }
  }, value), unit && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 13px/1 var(--font-mono)',
      color: 'var(--fg-2)'
    }
  }, unit)), /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      marginTop: 9,
      color: 'var(--fg-1)'
    }
  }, label)));
}
function BottomSection() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      marginBottom: 30
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    align: "center",
    sub: "A look at your taste, by the numbers"
  }, "Statistics"), /*#__PURE__*/React.createElement("div", {
    className: "aicdb-profile-bottom",
    style: {
      display: 'grid',
      gridTemplateColumns: '1.25fr 1fr',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      minHeight: 280,
      background: 'linear-gradient(140deg, #241a3a 0%, #18233a 48%, #0f2e2b 105%)',
      boxShadow: 'var(--shadow-2)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      opacity: 0.55,
      backgroundImage: 'linear-gradient(rgba(157,141,241,0.13) 1px, transparent 1px),' + 'linear-gradient(90deg, rgba(78,205,196,0.10) 1px, transparent 1px)',
      backgroundSize: '30px 30px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(75% 60% at 72% 18%, rgba(124,111,224,0.40), transparent 62%),' + 'radial-gradient(60% 50% at 12% 92%, rgba(78,205,196,0.28), transparent 60%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: -40,
      top: -40,
      width: 200,
      height: 200,
      borderRadius: '50%',
      border: '1px solid rgba(157,141,241,0.35)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: -10,
      top: -10,
      width: 140,
      height: 140,
      borderRadius: '50%',
      border: '1px solid rgba(78,205,196,0.30)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: '100%',
      padding: '26px 28px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "overline",
    style: {
      color: 'var(--type-vertical)'
    }
  }, "Favorite genre"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 52px/1 var(--font-display)',
      letterSpacing: '-0.015em',
      color: 'var(--fg-0)',
      margin: '10px 0 8px'
    }
  }, PROFILE.favGenre), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body)',
      color: 'var(--fg-1)',
      margin: 0,
      maxWidth: 300
    }
  }, PROFILE.favGenreShare))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1 / -1',
      padding: '20px 24px',
      background: 'var(--bg-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      color: 'var(--fg-1)',
      marginBottom: 10
    }
  }, "Average rating given"), /*#__PURE__*/React.createElement(StarRating, {
    value: PROFILE.avgRating,
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 44px/1 var(--font-mono)',
      color: 'var(--coral)',
      letterSpacing: '-0.02em'
    }
  }, PROFILE.avgRating.toFixed(1)), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 15px/1 var(--font-mono)',
      color: 'var(--fg-3)'
    }
  }, "/5"))), /*#__PURE__*/React.createElement(StatCard, {
    icon: "clock",
    color: "var(--teal)",
    value: PROFILE.hours.toLocaleString(),
    unit: "hrs",
    label: "Hours watched"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "chat-centered-text",
    color: "var(--type-vertical)",
    value: PROFILE.reviews,
    label: "Reviews written"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 20,
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    icon: "film-slate",
    color: "var(--coral)",
    value: PROFILE.thisYear,
    label: "Titles this year"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "fire",
    color: "var(--type-short)",
    value: "47",
    unit: "days",
    label: "Current streak"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "heart",
    color: "var(--coral)",
    value: FAVORITES.length,
    label: "Favorites"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "trophy",
    color: "var(--teal)",
    value: "Top 1%",
    label: "Reviewer rank"
  })));
}

// ---- Followed Creators — profile cards for creators the user follows ----
const FOLLOWED_CREATOR_IDS = ['maya', 'vale', 'theo', 'noor', 'nullframe', 'ito'];
function FollowedSeal({
  size = 14
}) {
  return /*#__PURE__*/React.createElement(Icon, {
    name: "seal-check",
    size: size,
    color: "var(--teal-bright)",
    weight: "fill"
  });
}

// ============================================================
// Following: compact box (top-right) + management modal
// Privacy is now a single list-wide setting (Public / Private) controlled
// from one button in the modal's top-right corner. When Private, the public
// box shows only a lock + "Followed" — no names or details to others.
// ============================================================

// list-wide privacy state, persisted as a single boolean.
function useFollowVisibility() {
  const KEY = 'aicdb_follow_private';
  const [isPrivate, setIsPrivate] = React.useState(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s != null) return JSON.parse(s);
    } catch (e) {}
    return false;
  });
  React.useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(isPrivate));
    } catch (e) {}
  }, [isPrivate]);
  return [isPrivate, setIsPrivate];
}
function followedList() {
  const byId = {};
  (window.AICDB_CREATORS || []).forEach(c => {
    byId[c.id] = c;
  });
  return FOLLOWED_CREATOR_IDS.map(id => byId[id]).filter(Boolean);
}

// overlapping avatar disc — gradient for public, lock for private
function FollowDisc({
  creator,
  isPrivate,
  size = 30,
  idx = 0
}) {
  const common = {
    width: size,
    height: size,
    borderRadius: '50%',
    flex: 'none',
    position: 'relative',
    border: '2px solid var(--bg-1)',
    marginLeft: idx === 0 ? 0 : -10,
    boxShadow: 'var(--shadow-1)'
  };
  if (isPrivate) {
    return /*#__PURE__*/React.createElement("div", {
      title: "Followed \u2014 private",
      style: {
        ...common,
        background: 'var(--bg-3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lock-simple",
      size: Math.round(size * 0.46),
      color: "var(--fg-2)",
      weight: "fill"
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    title: creator.name,
    style: {
      ...common,
      background: `linear-gradient(135deg, ${creator.av[0]}, ${creator.av[1]})`
    }
  });
}
function FollowingBox() {
  const [open, setOpen] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const [isPrivate, setIsPrivate] = useFollowVisibility();
  const followed = followedList();
  const total = followed.length;
  const allPrivate = isPrivate;
  const shown = followed.slice(0, 5);
  const overflow = total - shown.length;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    role: "button",
    tabIndex: 0,
    onClick: () => setOpen(true),
    onKeyDown: e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(true);
      }
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      padding: '20px 22px',
      background: hover ? 'var(--bg-2)' : 'var(--bg-1)',
      border: '1px solid',
      borderColor: hover ? 'var(--border-accent)' : 'var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      cursor: 'pointer',
      transform: hover ? 'translateY(-2px)' : 'none',
      transition: 'border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), transform var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 48px/0.9 var(--font-mono)',
      color: 'var(--coral)'
    }
  }, total), /*#__PURE__*/React.createElement(Icon, {
    name: "users",
    size: 20,
    color: "var(--coral-dim)",
    weight: "fill"
  })), allPrivate ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: '50%',
      flex: 'none',
      background: 'var(--bg-3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock-simple",
    size: 15,
    color: "var(--fg-2)",
    weight: "fill"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 13px/1 var(--font-body)',
      color: 'var(--fg-1)'
    }
  }, "Followed")) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      marginTop: 16
    }
  }, shown.map((c, i) => /*#__PURE__*/React.createElement(FollowDisc, {
    key: c.id,
    creator: c,
    isPrivate: false,
    idx: i
  })), overflow > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: '50%',
      flex: 'none',
      marginLeft: -10,
      background: 'var(--bg-3)',
      border: '2px solid var(--bg-1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      font: '600 11px/1 var(--font-mono)',
      color: 'var(--fg-1)'
    }
  }, "+", overflow)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "overline",
    style: {
      color: 'var(--fg-1)'
    }
  }, "Following"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      font: '600 12px/1 var(--font-body)',
      color: 'var(--coral)'
    }
  }, "Manage ", /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 13,
    color: "var(--coral)"
  })))), open && /*#__PURE__*/React.createElement(FollowingModal, {
    followed: followed,
    isPrivate: isPrivate,
    setIsPrivate: setIsPrivate,
    onClose: () => setOpen(false)
  }));
}

// the "Created lists" box — opens a management modal (view / edit / delete / new)
function CreatedListsBox() {
  const [hover, setHover] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [lists, setLists] = React.useState(CREATED_LISTS);
  const onDelete = id => setLists(ls => ls.filter(l => l.id !== id));
  const onRename = (id, title) => setLists(ls => ls.map(l => l.id === id ? {
    ...l,
    title
  } : l));
  const onNew = title => setLists(ls => [{
    id: 'l' + Date.now(),
    title,
    count: 0,
    note: 'A fresh, empty list'
  }, ...ls]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    role: "button",
    tabIndex: 0,
    onClick: () => setOpen(true),
    onKeyDown: e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(true);
      }
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      padding: '20px 22px',
      background: hover ? 'var(--bg-2)' : 'var(--bg-1)',
      border: '1px solid',
      borderColor: hover ? 'var(--border-accent)' : 'var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      cursor: 'pointer',
      transform: hover ? 'translateY(-2px)' : 'none',
      transition: 'border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), transform var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 48px/0.9 var(--font-mono)',
      color: 'var(--teal)'
    }
  }, lists.length), /*#__PURE__*/React.createElement(Icon, {
    name: "list",
    size: 20,
    color: "var(--teal-dim)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "overline",
    style: {
      color: 'var(--fg-1)'
    }
  }, "Created lists"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      font: '600 12px/1 var(--font-body)',
      color: 'var(--teal)'
    }
  }, "View ", /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 13,
    color: "var(--teal)"
  })))), open && /*#__PURE__*/React.createElement(CreatedListsModal, {
    lists: lists,
    onClose: () => setOpen(false),
    onDelete: onDelete,
    onRename: onRename,
    onNew: onNew
  }));
}

// a single editable row inside the Created-lists modal
function CreatedListRow({
  list,
  onDelete,
  onRename
}) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(list.title);
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    if (editing && inputRef.current) inputRef.current.select();
  }, [editing]);
  const commit = () => {
    const t = draft.trim();
    if (t) onRename(list.id, t);else setDraft(list.title);
    setEditing(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '14px 14px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--bg-0)',
      border: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 42,
      height: 42,
      flex: 'none',
      borderRadius: 'var(--radius-md)',
      background: 'var(--teal-ghost)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "list",
    size: 19,
    color: "var(--teal-bright)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, editing ? /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    value: draft,
    autoFocus: true,
    onChange: e => setDraft(e.target.value),
    onBlur: commit,
    onKeyDown: e => {
      if (e.key === 'Enter') commit();
      if (e.key === 'Escape') {
        setDraft(list.title);
        setEditing(false);
      }
    },
    style: {
      width: '100%',
      font: '600 15px/1.2 var(--font-body)',
      color: 'var(--fg-0)',
      background: 'var(--bg-3)',
      border: '1px solid var(--border-accent)',
      borderRadius: 'var(--radius-sm)',
      padding: '6px 9px',
      outline: 'none'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 15px/1.2 var(--font-body)',
      color: 'var(--fg-0)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, list.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      marginTop: 5,
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)'
    }
  }, /*#__PURE__*/React.createElement("span", null, list.count, " ", list.count === 1 ? 'title' : 'titles'), list.note && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-3)'
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, list.note)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => editing ? commit() : setEditing(true),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '8px 12px',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      background: 'var(--bg-2)',
      border: '1px solid var(--border-subtle)',
      color: 'var(--fg-1)',
      font: '600 12.5px/1 var(--font-body)',
      transition: 'all var(--dur-fast)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = 'var(--teal-bright)';
      e.currentTarget.style.color = 'var(--teal-bright)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = 'var(--border-subtle)';
      e.currentTarget.style.color = 'var(--fg-1)';
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pencil-simple",
    size: 14,
    color: "currentColor"
  }), " ", editing ? 'Save' : 'Edit'), /*#__PURE__*/React.createElement("button", {
    onClick: () => onDelete(list.id),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '8px 12px',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      background: 'var(--bg-2)',
      border: '1px solid var(--border-subtle)',
      color: 'var(--fg-1)',
      font: '600 12.5px/1 var(--font-body)',
      transition: 'all var(--dur-fast)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = 'var(--score-low)';
      e.currentTarget.style.color = 'var(--score-low)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = 'var(--border-subtle)';
      e.currentTarget.style.color = 'var(--fg-1)';
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trash",
    size: 14,
    color: "currentColor"
  }), " Delete")));
}
function CreatedListsModal({
  lists,
  onClose,
  onDelete,
  onRename,
  onNew
}) {
  const [creating, setCreating] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  const newRef = React.useRef(null);
  React.useEffect(() => {
    const h = e => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  React.useEffect(() => {
    if (creating && newRef.current) newRef.current.focus();
  }, [creating]);
  const commitNew = () => {
    const t = draft.trim();
    if (t) {
      onNew(t);
      setDraft('');
      setCreating(false);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: 'rgba(5,5,5,0.74)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)'
    }
  }, /*#__PURE__*/React.createElement("style", null, `@keyframes aicdbModalIn{from{transform:translateY(14px) scale(0.985)}to{transform:none}}`), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: 560,
      maxHeight: '84vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-1)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-3)',
      overflow: 'hidden',
      animation: 'aicdbModalIn 0.34s var(--ease-out) both'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12,
      padding: '24px 26px 18px',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: '600 22px/1.2 var(--font-display)',
      color: 'var(--fg-0)',
      margin: 0
    }
  }, "Created lists"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)',
      margin: '7px 0 0'
    }
  }, lists.length, " ", lists.length === 1 ? 'list' : 'lists', " \xB7 curate your own corners of the catalog")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setCreating(c => !c),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      padding: '9px 14px',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      background: 'var(--coral)',
      border: '1px solid transparent',
      color: 'var(--fg-on-accent)',
      font: '600 13px/1 var(--font-body)',
      transition: 'all var(--dur-fast)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'var(--coral-bright)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'var(--coral)';
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 14,
    color: "currentColor",
    weight: "bold"
  }), " New list"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      display: 'flex',
      padding: 8,
      borderRadius: '50%',
      flex: 'none',
      cursor: 'pointer',
      background: 'var(--bg-2)',
      border: '1px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 15,
    color: "var(--fg-1)"
  })))), creating && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '14px 26px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--bg-0)'
    }
  }, /*#__PURE__*/React.createElement("input", {
    ref: newRef,
    value: draft,
    placeholder: "Name your new list\u2026",
    onChange: e => setDraft(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') commitNew();
      if (e.key === 'Escape') {
        setDraft('');
        setCreating(false);
      }
    },
    style: {
      flex: 1,
      font: 'var(--text-body)',
      color: 'var(--fg-0)',
      background: 'var(--bg-3)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      padding: '10px 12px',
      outline: 'none'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: commitNew,
    style: {
      padding: '10px 16px',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      background: 'var(--coral)',
      border: '1px solid transparent',
      color: 'var(--fg-on-accent)',
      font: '600 13px/1 var(--font-body)'
    }
  }, "Create")), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowY: 'auto',
      padding: '14px 18px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, lists.length ? lists.map(l => /*#__PURE__*/React.createElement(CreatedListRow, {
    key: l.id,
    list: l,
    onDelete: onDelete,
    onRename: onRename
  })) : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '48px 0',
      textAlign: 'center',
      font: 'var(--text-body)',
      color: 'var(--fg-2)'
    }
  }, "No lists yet \u2014 hit ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--fg-1)'
    }
  }, "New list"), " to start one."))));
}

// single small list-wide privacy button (lives in the modal's top-right corner)
function ListPrivacyButton({
  isPrivate,
  onToggle
}) {
  const [hover, setHover] = React.useState(false);
  const accent = isPrivate ? 'var(--fg-1)' : 'var(--teal-bright)';
  return /*#__PURE__*/React.createElement("button", {
    onClick: onToggle,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    title: isPrivate ? 'Following list is private — tap to make public' : 'Following list is public — tap to make private',
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      padding: '8px 13px',
      flex: 'none',
      cursor: 'pointer',
      borderRadius: 'var(--radius-pill)',
      border: '1px solid',
      borderColor: hover ? 'var(--border-strong)' : 'var(--border-default)',
      background: hover ? 'var(--bg-2)' : 'var(--bg-0)',
      font: '600 12px/1 var(--font-body)',
      color: accent,
      transition: 'all var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: isPrivate ? 'lock-simple' : 'eye',
    size: 13,
    color: accent,
    weight: isPrivate ? 'fill' : 'regular'
  }), isPrivate ? 'Private' : 'Public');
}
function FollowingModal({
  followed,
  isPrivate,
  setIsPrivate,
  onClose
}) {
  React.useEffect(() => {
    const h = e => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: 'rgba(5,5,5,0.74)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)'
    }
  }, /*#__PURE__*/React.createElement("style", null, `@keyframes aicdbModalIn{from{transform:translateY(14px) scale(0.985)}to{transform:none}}`), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: 480,
      maxHeight: '82vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-1)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-3)',
      overflow: 'hidden',
      animation: 'aicdbModalIn 0.34s var(--ease-out) both'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12,
      padding: '24px 26px 18px',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: '600 22px/1.2 var(--font-display)',
      color: 'var(--fg-0)',
      margin: 0
    }
  }, "Following"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)',
      margin: '7px 0 0'
    }
  }, followed.length, " creators \xB7 list is ", isPrivate ? 'hidden from others' : 'visible to others')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(ListPrivacyButton, {
    isPrivate: isPrivate,
    onToggle: () => setIsPrivate(p => !p)
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      display: 'flex',
      padding: 8,
      borderRadius: '50%',
      flex: 'none',
      cursor: 'pointer',
      background: 'var(--bg-2)',
      border: '1px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 15,
    color: "var(--fg-1)"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowY: 'auto',
      padding: '8px 14px 14px'
    }
  }, followed.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '12px 12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 46,
      height: 46,
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${c.av[0]}, ${c.av[1]})`,
      filter: isPrivate ? 'grayscale(0.5) brightness(0.7)' : 'none',
      boxShadow: 'var(--shadow-1)'
    }
  }), isPrivate && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: -3,
      bottom: -3,
      width: 20,
      height: 20,
      borderRadius: '50%',
      background: 'var(--bg-2)',
      border: '1px solid var(--border-default)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock-simple",
    size: 11,
    color: "var(--fg-1)",
    weight: "fill"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 15px/1.2 var(--font-body)',
      color: 'var(--fg-0)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, c.name), c.verified && /*#__PURE__*/React.createElement(FollowedSeal, {
    size: 13
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)',
      marginTop: 3
    }
  }, c.handle)), /*#__PURE__*/React.createElement(FollowingButton, null)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '14px 26px',
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--bg-0)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: isPrivate ? 'lock-simple' : 'eye',
    size: 15,
    color: "var(--fg-2)",
    weight: isPrivate ? 'fill' : 'regular'
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)'
    }
  }, isPrivate ? 'Your whole Following list is private — others see only a lock, no names or details.' : 'Your Following list is public — anyone can see who you follow.'))));
}
function FollowingButton() {
  const [following, setFollowing] = React.useState(true);
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => setFollowing(f => !f),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      padding: '9px 0',
      width: '100%',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      font: '600 13px/1 var(--font-body)',
      transition: 'all var(--dur-fast)',
      borderWidth: 1,
      borderStyle: 'solid',
      background: following ? 'transparent' : hover ? 'var(--coral-bright)' : 'var(--coral)',
      borderColor: following ? 'var(--border-strong)' : 'transparent',
      color: following ? hover ? 'var(--score-low)' : 'var(--fg-1)' : 'var(--fg-on-accent)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: following ? hover ? 'x' : 'check' : 'plus',
    size: 14,
    color: "currentColor",
    weight: "bold"
  }), following ? hover ? 'Unfollow' : 'Following' : 'Follow');
}
function FollowedCreatorCard({
  creator
}) {
  const [hover, setHover] = React.useState(false);
  const st = window.AICDB_CREATOR_STATS ? window.AICDB_CREATOR_STATS(creator) : {
    works: 0,
    avg: 0
  };
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--bg-1)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px 20px 18px',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: hover ? 'var(--border-default)' : 'var(--border-subtle)',
      transition: 'border-color var(--dur-fast), transform var(--dur-base)',
      transform: hover ? 'translateY(-3px)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: 'creator.html?name=' + encodeURIComponent(creator.name),
    style: {
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 54,
      height: 54,
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${creator.av[0]}, ${creator.av[1]})`,
      boxShadow: 'var(--shadow-1)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: 'creator.html?name=' + encodeURIComponent(creator.name),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 16px/1.2 var(--font-display)',
      color: 'var(--fg-0)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, creator.name), creator.verified && /*#__PURE__*/React.createElement(FollowedSeal, {
    size: 14
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)',
      marginTop: 3
    }
  }, creator.handle))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      marginBottom: 16,
      padding: '12px 0',
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, [[fmtCount(creator.followers), 'Followers', 'var(--fg-0)'], [st.works, 'Works', 'var(--fg-0)'], [st.avg ? st.avg.toFixed(1) : '—', 'Avg score', scoreColor(st.avg)]].map(([v, l, col], i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: l
  }, i > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      background: 'var(--border-subtle)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 16px/1 var(--font-mono)',
      color: col
    }
  }, v), /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      color: 'var(--fg-2)',
      marginTop: 6
    }
  }, l))))), /*#__PURE__*/React.createElement(FollowingButton, null));
}
function FollowedCreators() {
  const byId = {};
  (window.AICDB_CREATORS || []).forEach(c => {
    byId[c.id] = c;
  });
  const followed = FOLLOWED_CREATOR_IDS.map(id => byId[id]).filter(Boolean);
  if (!followed.length) return null;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      marginBottom: 64
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    align: "center",
    sub: `${followed.length} creators you follow`
  }, "Followed Creators"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(248px, 1fr))',
      gap: 18
    }
  }, followed.map(c => /*#__PURE__*/React.createElement(FollowedCreatorCard, {
    key: c.id,
    creator: c
  }))));
}

// ---- linked creator accounts shown on the main profile (toggle-controlled) ----
function LinkedCreatorAccounts() {
  const accounts = useCreatorAccounts().filter(a => a.showOnProfile);
  if (!accounts.length) return null;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      marginBottom: 56
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    align: "center",
    sub: "Creator accounts connected to this profile"
  }, "Also creating as"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      flexWrap: 'wrap',
      justifyContent: 'center'
    }
  }, accounts.map(a => /*#__PURE__*/React.createElement("a", {
    key: a.id,
    href: 'creator.html?account=' + encodeURIComponent(a.id),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '14px 20px 14px 14px',
      textDecoration: 'none',
      background: 'var(--bg-1)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-pill)',
      transition: 'border-color var(--dur-fast), background var(--dur-fast)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = 'var(--border-accent)';
      e.currentTarget.style.background = 'var(--bg-2)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = 'var(--border-default)';
      e.currentTarget.style.background = 'var(--bg-1)';
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 46,
      height: 46,
      borderRadius: '50%',
      flex: 'none',
      background: a.avatar ? `linear-gradient(135deg, ${a.avatar[0]}, ${a.avatar[1]})` : 'var(--bg-3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      font: '600 18px/1 var(--font-display)',
      color: 'rgba(255,255,255,0.92)'
    }
  }, (a.name || 'C').charAt(0).toUpperCase()), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 15px/1.2 var(--font-body)',
      color: 'var(--fg-0)'
    }
  }, a.name), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 9px/1 var(--font-body)',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      color: 'var(--coral-bright)',
      background: 'var(--coral-ghost)',
      padding: '3px 7px',
      borderRadius: 'var(--radius-pill)'
    }
  }, "Creator")), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)',
      marginTop: 4
    }
  }, a.handle || '')), /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 15,
    color: "var(--fg-3)"
  })))));
}

// ============================================================
// Reviews — the user's submitted written reviews (bottom of profile)
// ============================================================
const PROFILE_REVIEWS = [{
  id: 'echoes-of-tomorrow',
  you: 5,
  date: '2026-05-31',
  likes: 142,
  body: "Still the bar. The third act rewires how you think about memory on a second watch — I keep finding new seams in the edit."
}, {
  id: 'glass-orchard',
  you: 4,
  date: '2026-05-22',
  likes: 64,
  body: "Quiet, patient, and gorgeously lit. Not for everyone, but if you let it breathe it gets under your skin. The glass-fruit reveal is one for the year-end lists."
}, {
  id: 'the-long-render',
  you: 3.5,
  date: '2026-05-14',
  likes: 38,
  body: "Technically dazzling and emotionally cold — on purpose, I think. I wanted a little more heart underneath the obsession, but the final frame nearly earns the whole decade."
}, {
  id: 'paper-suns',
  you: 4.5,
  date: '2026-04-30',
  likes: 91,
  body: "Eleven wordless minutes that say more than most features. The folded-paper dawn sequence is the most beautiful thing I've seen out of a frame-interpolation pipeline."
}];
function ProfileReviewRow({
  r,
  onOpen
}) {
  const film = r.film;
  const t = window.AICDB_TYPES[film.type];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      padding: '18px 20px',
      background: 'var(--bg-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => onOpen && onOpen(film),
    style: {
      width: 58,
      flex: 'none',
      aspectRatio: '2/3',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      cursor: 'pointer',
      background: `linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 150%)`,
      boxShadow: 'var(--shadow-1)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => onOpen && onOpen(film),
    style: {
      font: '600 17px/1.2 var(--font-display)',
      color: 'var(--fg-0)',
      cursor: 'pointer'
    }
  }, film.title), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 9px/1 var(--font-body)',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      color: t.text,
      background: t.ghost,
      padding: '4px 8px',
      borderRadius: 'var(--radius-pill)'
    }
  }, t.label), /*#__PURE__*/React.createElement(StarRating, {
    value: r.you,
    size: 14
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-3)'
    }
  }, "\xB7 ", fmtRatedDate(r.date))), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body)',
      color: 'var(--fg-1)',
      margin: '0 0 12px'
    }
  }, r.body), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)',
      marginRight: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "heart",
    size: 14,
    color: "var(--fg-3)"
  }), " ", r.likes), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    icon: "pencil-simple"
  }, "Edit"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    icon: "trash"
  }, "Delete"))));
}
function ProfileReviews({
  onOpen
}) {
  const byId = filmsById();
  const rows = PROFILE_REVIEWS.map(r => ({
    ...r,
    film: byId[r.id]
  })).filter(r => r.film);
  if (!rows.length) return null;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    align: "center",
    sub: `${PROFILE.reviews} reviews written · your most recent takes`
  }, "Reviews"), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 820,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, rows.map(r => /*#__PURE__*/React.createElement(ProfileReviewRow, {
    key: r.id,
    r: r,
    onOpen: onOpen
  }))));
}

// ---- Page ----
function Profile({
  embedded = false,
  onOpen
}) {
  const [showAllRatings, setShowAllRatings] = React.useState(false);
  if (showAllRatings) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: embedded ? 'auto' : '100vh'
      }
    }, !embedded && /*#__PURE__*/React.createElement(NavBar, {
      active: ""
    }), /*#__PURE__*/React.createElement(AllRatingsPage, {
      onBack: () => {
        setShowAllRatings(false);
        window.scrollTo(0, 0);
      },
      onOpen: onOpen
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: embedded ? 'auto' : '100vh'
    }
  }, !embedded && /*#__PURE__*/React.createElement(NavBar, {
    active: ""
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1100,
      margin: '0 auto',
      padding: '28px 28px 90px'
    }
  }, /*#__PURE__*/React.createElement(TopSection, null), /*#__PURE__*/React.createElement(LinkedCreatorAccounts, null), /*#__PURE__*/React.createElement(LastRated, {
    onOpen: onOpen,
    onSeeAll: () => {
      setShowAllRatings(true);
      window.scrollTo(0, 0);
    }
  }), /*#__PURE__*/React.createElement(LowerSection, null), /*#__PURE__*/React.createElement(BottomSection, null), /*#__PURE__*/React.createElement(ProfileReviews, {
    onOpen: onOpen
  })));
}
Object.assign(window, {
  Profile
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/Profile.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/RatingPanel.jsx
try { (() => {
// Dreamwall UI kit — rating panel: Visuals / Sound Design / Script → averaged score.
function RatingSlider({
  label,
  icon,
  value,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [drag, setDrag] = React.useState(false);
  const setFrom = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const v = Math.round(Math.max(0, Math.min(1, (clientX - r.left) / r.width)) * 20) / 2; // 0–10, 0.5 steps
    onChange(v);
  };
  React.useEffect(() => {
    if (!drag) return;
    const move = e => setFrom(e.clientX);
    const up = () => setDrag(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
  }, [drag]);
  const pct = value / 10 * 100;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 9,
      font: '600 14px/1 var(--font-body)',
      color: 'var(--fg-0)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 16,
    color: "var(--fg-1)"
  }), label), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 18px/1 var(--font-mono)',
      color: value ? 'var(--coral)' : 'var(--fg-3)'
    }
  }, value.toFixed(1))), /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    onMouseDown: e => {
      e.preventDefault();
      setDrag(true);
      setFrom(e.clientX);
    },
    style: {
      position: 'relative',
      height: 8,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--rating-track)',
      cursor: 'pointer',
      touchAction: 'none',
      userSelect: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      width: `${pct}%`,
      borderRadius: 'var(--radius-pill)',
      background: 'linear-gradient(90deg, var(--coral-dim), var(--coral))'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '50%',
      left: `${pct}%`,
      width: 18,
      height: 18,
      borderRadius: '50%',
      background: 'var(--coral)',
      border: '2px solid var(--bg-1)',
      boxShadow: 'var(--shadow-2)',
      transform: 'translate(-50%,-50%)'
    }
  })));
}
function RatingPanel({
  film,
  onClose,
  onSubmit
}) {
  const [r, setR] = React.useState({
    Visuals: 0,
    'Sound Design': 0,
    Script: 0
  });
  const vals = Object.values(r);
  const rated = vals.filter(v => v > 0).length;
  const avg = rated ? vals.reduce((a, b) => a + b, 0) / 3 : 0;
  const set = k => v => setR(s => ({
    ...s,
    [k]: v
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(5,5,5,0.72)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 460,
      background: 'var(--bg-1)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-3)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      padding: '22px 24px 6px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      font: 'var(--text-h3)',
      color: 'var(--fg-0)'
    }
  }, "Rate this title"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)',
      margin: '4px 0 0'
    }
  }, "Your three scores average into one.")), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 4
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 20,
    color: "var(--fg-2)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 24px 4px'
    }
  }, /*#__PURE__*/React.createElement(RatingSlider, {
    label: "Visuals",
    icon: "eye",
    value: r.Visuals,
    onChange: set('Visuals')
  }), /*#__PURE__*/React.createElement(RatingSlider, {
    label: "Sound Design",
    icon: "music-notes",
    value: r['Sound Design'],
    onChange: set('Sound Design')
  }), /*#__PURE__*/React.createElement(RatingSlider, {
    label: "Script",
    icon: "pencil",
    value: r.Script,
    onChange: set('Script')
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      margin: '4px 24px 0',
      background: 'var(--bg-0)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-subtle)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: '14px 18px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      color: 'var(--fg-2)',
      marginBottom: 6
    }
  }, "Score"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 30px/1 var(--font-mono)',
      color: scoreColor(film.score)
    }
  }, film.score.toFixed(1))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      background: 'var(--border-subtle)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: '14px 18px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      color: 'var(--coral-bright)',
      marginBottom: 6
    }
  }, "Your Score"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 30px/1 var(--font-mono)',
      color: avg ? 'var(--coral)' : 'var(--fg-3)'
    }
  }, avg ? avg.toFixed(1) : '—'))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 24px 22px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    disabled: !rated,
    onClick: () => onSubmit(avg),
    style: {
      width: '100%',
      padding: '13px 16px',
      borderRadius: 'var(--radius-md)',
      border: 'none',
      cursor: rated ? 'pointer' : 'not-allowed',
      font: '600 15px/1 var(--font-body)',
      background: rated ? 'var(--coral)' : 'var(--bg-3)',
      color: rated ? 'var(--fg-on-accent)' : 'var(--fg-3)',
      transition: 'background var(--dur-fast)'
    }
  }, rated ? `Submit score · ${avg.toFixed(1)}` : 'Rate all three to submit'))));
}
Object.assign(window, {
  RatingPanel,
  RatingSlider
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/RatingPanel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/Signup.jsx
try { (() => {
// Dreamwall UI kit — Sign up flow (3 steps): choice → email form → verify
// Reuses SocialButton, Field, PrimaryWideButton from Login.jsx (loaded before this file).

function CardShell({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 20px',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      background: 'radial-gradient(120% 90% at 18% 8%, rgba(216,90,48,0.16) 0%, rgba(216,90,48,0) 42%),' + 'radial-gradient(110% 80% at 88% 92%, rgba(78,205,196,0.13) 0%, rgba(78,205,196,0) 46%),' + 'radial-gradient(80% 60% at 70% 18%, rgba(157,141,241,0.10) 0%, rgba(157,141,241,0) 50%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      opacity: 0.5,
      backgroundImage: 'radial-gradient(rgba(245,243,239,0.035) 1px, transparent 1px)',
      backgroundSize: '4px 4px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      width: '100%',
      maxWidth: 404,
      background: 'rgba(21,21,20,0.82)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-3)',
      padding: '34px 36px 30px'
    }
  }, children));
}
function Stepper({
  step
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      justifyContent: 'center',
      marginBottom: 22
    }
  }, [1, 2, 3].map(n => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      height: 4,
      width: n === step ? 26 : 18,
      borderRadius: 2,
      background: n === step ? 'var(--coral)' : n < step ? 'var(--coral-dim)' : 'var(--bg-3)',
      transition: 'width var(--dur-base) var(--ease-out), background-color var(--dur-base) var(--ease-out)'
    }
  })));
}
function BackLink({
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      marginBottom: 14,
      color: 'var(--fg-1)',
      font: '500 13px/1 var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-left",
    size: 15
  }), " Back");
}
function Header({
  title,
  sub
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: window.__resources && window.__resources.aicdbMark || "../../assets/aicdb-mark.png",
    width: "48",
    height: "48",
    alt: "",
    style: {
      filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.6))',
      marginBottom: 16
    }
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: '600 25px/1.12 var(--font-display)',
      letterSpacing: '-0.01em',
      color: 'var(--fg-0)',
      marginBottom: 8
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-1)',
      margin: 0,
      maxWidth: 300
    }
  }, sub));
}

// ---------- Step 1: choice ----------
function StepChoice({
  onEmail
}) {
  const socials = [{
    key: 'google',
    icon: /*#__PURE__*/React.createElement(GoogleIcon, {
      size: 18
    }),
    label: 'Sign up with Google'
  }, {
    key: 'facebook',
    icon: /*#__PURE__*/React.createElement(FacebookIcon, {
      size: 18
    }),
    label: 'Sign up with Facebook'
  }, {
    key: 'instagram',
    icon: /*#__PURE__*/React.createElement(InstagramIcon, {
      size: 18
    }),
    label: 'Sign up with Instagram'
  }, {
    key: 'x',
    icon: /*#__PURE__*/React.createElement(XIcon, {
      size: 15
    }),
    label: 'Sign up with X'
  }, {
    key: 'tiktok',
    icon: /*#__PURE__*/React.createElement(TikTokIcon, {
      size: 17
    }),
    label: 'Sign up with TikTok'
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Header, {
    title: "Create your account",
    sub: "Join Dreamwall to rate, review and track AI-generated films & series."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, socials.map(s => /*#__PURE__*/React.createElement(SocialButton, {
    key: s.key,
    icon: s.icon,
    label: s.label,
    onClick: () => {}
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      margin: '22px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: 'var(--border-default)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "overline",
    style: {
      color: 'var(--fg-3)'
    }
  }, "or"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: 'var(--border-default)'
    }
  })), /*#__PURE__*/React.createElement(PrimaryWideButton, {
    onClick: onEmail
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "message-square",
    size: 16
  }), " Sign up with email")), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'center',
      font: 'var(--text-body-sm)',
      color: 'var(--fg-1)',
      margin: '22px 0 0'
    }
  }, "Already have an account? ", /*#__PURE__*/React.createElement("a", {
    href: "login.html",
    style: {
      color: 'var(--teal)',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "Sign in")));
}

// ---------- Step 2: email form ----------
function StepForm({
  onBack,
  onSubmit
}) {
  const [f, setF] = React.useState({
    first: '',
    last: '',
    email: '',
    pw: '',
    pw2: ''
  });
  const [showPw, setShowPw] = React.useState(false);
  const set = k => e => setF(s => ({
    ...s,
    [k]: e.target.value
  }));
  const pwOk = f.pw.length >= 8;
  const match = f.pw2.length > 0 && f.pw === f.pw2;
  const mismatch = f.pw2.length > 0 && f.pw !== f.pw2;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(BackLink, {
    onClick: onBack
  }), /*#__PURE__*/React.createElement(Header, {
    title: "Sign up with email",
    sub: "Fill in your details to create your Dreamwall account."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "First name",
    value: f.first,
    onChange: set('first'),
    placeholder: "Ada"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Last name",
    value: f.last,
    onChange: set('last'),
    placeholder: "Lovelace"
  }))), /*#__PURE__*/React.createElement(Field, {
    label: "Email",
    type: "email",
    value: f.email,
    onChange: set('email'),
    placeholder: "you@example.com"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Field, {
    label: "Password",
    type: showPw ? 'text' : 'password',
    value: f.pw,
    onChange: set('pw'),
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    trailing: /*#__PURE__*/React.createElement("button", {
      onClick: () => setShowPw(v => !v),
      "aria-label": "Toggle password",
      style: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 4,
        display: 'flex',
        color: 'var(--fg-2)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "eye",
      size: 17
    }))
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-caption)',
      color: f.pw.length === 0 ? 'var(--fg-3)' : pwOk ? 'var(--teal)' : 'var(--fg-2)',
      margin: '8px 2px 0'
    }
  }, f.pw.length === 0 ? 'At least 8 characters.' : pwOk ? '✓ Strong enough.' : 'At least 8 characters.')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Field, {
    label: "Confirm password",
    type: showPw ? 'text' : 'password',
    value: f.pw2,
    onChange: set('pw2'),
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
  }), mismatch && /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--danger)',
      margin: '8px 2px 0'
    }
  }, "Passwords don\u2019t match."), match && /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--teal)',
      margin: '8px 2px 0'
    }
  }, "\u2713 Passwords match.")), /*#__PURE__*/React.createElement(PrimaryWideButton, {
    onClick: () => onSubmit(f.email)
  }, "Create account")), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'center',
      font: 'var(--text-caption)',
      color: 'var(--fg-2)',
      margin: '16px 4px 0',
      lineHeight: 1.5
    }
  }, "By creating an account you agree to our ", /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'var(--fg-1)',
      textDecoration: 'underline',
      cursor: 'pointer'
    }
  }, "Terms"), " and ", /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'var(--fg-1)',
      textDecoration: 'underline',
      cursor: 'pointer'
    }
  }, "Privacy Policy"), "."));
}

// ---------- Step 3: verify ----------
function CodeInput({
  value,
  onChange
}) {
  const refs = React.useRef([]);
  const digits = value.padEnd(6, ' ').split('').slice(0, 6);
  const handle = (i, v) => {
    const ch = v.replace(/\D/g, '').slice(-1);
    const arr = value.padEnd(6, ' ').split('');
    arr[i] = ch || ' ';
    onChange(arr.join('').replace(/ /g, ' ').trimEnd().replace(/ /g, ''));
    if (ch && refs.current[i + 1]) refs.current[i + 1].focus();
  };
  const keyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i].trim() && refs.current[i - 1]) refs.current[i - 1].focus();
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 9,
      justifyContent: 'center'
    }
  }, digits.map((d, i) => {
    const filled = d.trim().length > 0;
    return /*#__PURE__*/React.createElement("input", {
      key: i,
      ref: el => refs.current[i] = el,
      value: d.trim(),
      inputMode: "numeric",
      maxLength: 1,
      onChange: e => handle(i, e.target.value),
      onKeyDown: e => keyDown(i, e),
      style: {
        width: 46,
        height: 56,
        textAlign: 'center',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-3)',
        border: '1px solid',
        borderColor: filled ? 'var(--border-accent)' : 'var(--border-default)',
        color: 'var(--fg-0)',
        font: '600 24px/1 var(--font-mono)',
        outline: 'none',
        transition: 'border-color var(--dur-fast)'
      }
    });
  }));
}
function StepVerify({
  email,
  onBack
}) {
  const [code, setCode] = React.useState('');
  const [secs, setSecs] = React.useState(30);
  React.useEffect(() => {
    if (secs <= 0) return;
    const t = setTimeout(() => setSecs(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);
  const done = code.length === 6;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(BackLink, {
    onClick: onBack
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 60,
      height: 60,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--coral-ghost)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "mail",
    size: 26,
    color: "var(--coral-bright)"
  })), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: '600 25px/1.12 var(--font-display)',
      letterSpacing: '-0.01em',
      color: 'var(--fg-0)',
      marginBottom: 8
    }
  }, "Check your inbox"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-1)',
      margin: 0,
      maxWidth: 310
    }
  }, "We sent a 6-digit code to ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-0)',
      fontWeight: 600
    }
  }, email || 'your email'), ". Enter it below to verify your account.")), /*#__PURE__*/React.createElement(CodeInput, {
    value: code,
    onChange: setCode
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement(PrimaryWideButton, {
    onClick: () => {}
  }, done ? 'Verify & continue' : 'Enter 6-digit code')), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'center',
      font: 'var(--text-body-sm)',
      color: 'var(--fg-1)',
      margin: '20px 0 0'
    }
  }, "Didn\u2019t get the code?", ' ', secs > 0 ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-3)'
    }
  }, "Resend in ", secs, "s") : /*#__PURE__*/React.createElement("a", {
    onClick: () => setSecs(30),
    style: {
      color: 'var(--teal)',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "Resend code")));
}

// ---------- Flow controller ----------
function Signup() {
  const [step, setStep] = React.useState(1);
  const [email, setEmail] = React.useState('');
  return /*#__PURE__*/React.createElement(CardShell, null, /*#__PURE__*/React.createElement(Stepper, {
    step: step
  }), step === 1 && /*#__PURE__*/React.createElement(StepChoice, {
    onEmail: () => setStep(2)
  }), step === 2 && /*#__PURE__*/React.createElement(StepForm, {
    onBack: () => setStep(1),
    onSubmit: e => {
      setEmail(e);
      setStep(3);
    }
  }), step === 3 && /*#__PURE__*/React.createElement(StepVerify, {
    email: email,
    onBack: () => setStep(2)
  }));
}
Object.assign(window, {
  Signup
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/Signup.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/Watching.jsx
try { (() => {
// Dreamwall UI kit — Watching page (mock player) opened from the detail page's Watch button.
function Watching({
  film,
  onBack
}) {
  const d = window.AICDB_DETAILS[film.id] || {};
  const isSeries = film.type === 'series';
  const [playing, setPlaying] = React.useState(true);
  const [progress, setProgress] = React.useState(0.18);
  const [ep, setEp] = React.useState(1);
  const episodes = isSeries ? Array.from({
    length: Math.min(d.episodes || 8, 8)
  }, (_, i) => i + 1) : [];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      background: 'var(--bg-inset)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '14px 28px',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: 'var(--bg-2)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-pill)',
      padding: '8px 14px',
      cursor: 'pointer',
      color: 'var(--fg-0)',
      font: '500 13px/1 var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-left",
    size: 16
  }), " Back to title"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 14px/1 var(--font-body)',
      color: 'var(--fg-1)'
    }
  }, "Now watching \xB7 ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-0)'
    }
  }, film.title), isSeries ? ` · S1·E${ep}` : '')), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: '0 auto',
      padding: '28px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '16/9',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      background: `linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 170%)`,
      boxShadow: 'var(--shadow-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(60% 60% at 50% 45%, transparent, rgba(0,0,0,0.55))'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPlaying(p => !p),
    style: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)',
      width: 78,
      height: 78,
      borderRadius: '50%',
      cursor: 'pointer',
      border: '1px solid rgba(255,255,255,0.4)',
      background: 'rgba(10,10,10,0.4)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: playing ? 'pause' : 'play',
    size: 32,
    color: "#fff",
    weight: "fill"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      padding: '40px 24px 18px',
      background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => {
      const r = e.currentTarget.getBoundingClientRect();
      setProgress(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)));
    },
    style: {
      position: 'relative',
      height: 6,
      borderRadius: 'var(--radius-pill)',
      background: 'rgba(255,255,255,0.25)',
      cursor: 'pointer',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      width: `${progress * 100}%`,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--coral)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '50%',
      left: `${progress * 100}%`,
      width: 14,
      height: 14,
      borderRadius: '50%',
      background: 'var(--coral)',
      transform: 'translate(-50%,-50%)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: playing ? 'pause' : 'play',
    size: 20,
    color: "#fff",
    weight: "fill",
    style: {
      cursor: 'pointer'
    }
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "speaker-high",
    size: 20,
    color: "rgba(255,255,255,0.85)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 12px/1 var(--font-mono)',
      color: 'rgba(255,255,255,0.85)'
    }
  }, fmtTime(progress, film), " / ", totalTime(film)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "gear",
    size: 20,
    color: "rgba(255,255,255,0.85)"
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "corners-out",
    size: 20,
    color: "rgba(255,255,255,0.85)"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 24,
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(ContentBadge, {
    type: film.type
  }), isSeries && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-1)'
    }
  }, "Season 1 \xB7 Episode ", ep)), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--text-h2)',
      color: 'var(--fg-0)'
    }
  }, film.title), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-body)',
      color: 'var(--fg-1)',
      maxWidth: 620,
      marginTop: 10
    }
  }, film.synopsis)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 'none',
      textAlign: 'center',
      padding: '14px 20px',
      background: 'var(--bg-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 30px/1 var(--font-mono)',
      color: scoreColor(film.score)
    }
  }, film.score.toFixed(1)), /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      color: 'var(--fg-2)',
      marginTop: 6
    }
  }, "Score"))), isSeries && /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 36
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      font: 'var(--text-h3)',
      color: 'var(--fg-0)',
      marginBottom: 16
    }
  }, "Episodes"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: 14
    }
  }, episodes.map(n => /*#__PURE__*/React.createElement("div", {
    key: n,
    onClick: () => setEp(n),
    style: {
      display: 'flex',
      gap: 12,
      padding: 10,
      cursor: 'pointer',
      borderRadius: 'var(--radius-lg)',
      background: n === ep ? 'var(--bg-2)' : 'var(--bg-1)',
      border: '1px solid ' + (n === ep ? 'var(--border-accent)' : 'var(--border-subtle)')
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 72,
      height: 44,
      flex: 'none',
      borderRadius: 6,
      position: 'relative',
      overflow: 'hidden',
      background: `linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 160%)`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "play",
    size: 16,
    color: "rgba(255,255,255,0.9)",
    weight: "fill"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 13px/1.2 var(--font-body)',
      color: 'var(--fg-0)'
    }
  }, "Episode ", n), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-data-sm)',
      color: 'var(--fg-2)',
      marginTop: 4
    }
  }, 38 + n * 2, "m"))))))));
}
function totalTime(film) {
  if (film.type === 'series') return '44:00';
  const m = parseInt(String(film.runtime).replace(/[^0-9]/g, ''), 10) || 100;
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}:00`.replace(/^0:/, '');
}
function fmtTime(progress, film) {
  const m = film.type === 'series' ? 44 : parseInt(String(film.runtime).replace(/[^0-9]/g, ''), 10) || 100;
  const cur = Math.round(m * 60 * progress);
  const hh = Math.floor(cur / 3600),
    mm = Math.floor(cur % 3600 / 60),
    ss = cur % 60;
  return (hh ? hh + ':' : '') + String(mm).padStart(hh ? 2 : 1, '0') + ':' + String(ss).padStart(2, '0');
}
Object.assign(window, {
  Watching
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/Watching.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/WhatIs.jsx
try { (() => {
// Dreamwall UI kit — "What is Dreamwall" manifesto page.
// Minimal, editorial, scroll-revealed. Reads like a mission statement,
// not a marketing page: what it is, why it exists, how ratings work, how to join.

// ---- scroll/mount reveal wrapper.
// Resting state is VISIBLE; a one-shot CSS entrance animates UP from hidden.
// This guarantees content is never stuck invisible (animation only sweetens it),
// and is disabled under prefers-reduced-motion via the stylesheet below.
function Reveal({
  children,
  delay = 0,
  as = 'div',
  style
}) {
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, {
    className: "wi-reveal",
    style: {
      ...style,
      animationDelay: `${delay}ms`
    }
  }, children);
}

// ---- numbered section block ----
function ManifestoSection({
  num,
  kicker,
  title,
  children,
  accent = 'var(--coral-bright)'
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '88px 0',
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,180px) minmax(0,1fr)',
      gap: '48px',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Reveal, {
    style: {
      position: 'sticky',
      top: 120
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 15px/1 var(--font-mono)',
      color: accent,
      marginBottom: 14
    }
  }, num), /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      color: 'var(--fg-2)'
    }
  }, kicker)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: '600 38px/1.16 var(--font-display)',
      letterSpacing: '-0.015em',
      color: 'var(--fg-0)',
      margin: '0 0 28px',
      maxWidth: 680
    }
  }, title)), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, children))));
}
function Lead({
  children
}) {
  return /*#__PURE__*/React.createElement("p", {
    style: {
      font: '400 20px/1.62 var(--font-body)',
      color: 'var(--fg-1)',
      margin: '0 0 22px',
      maxWidth: 640
    }
  }, children);
}

// ---- how ratings work: visual of users → score ----
function RatingDiagram() {
  const avatars = [['#d85a30', '#9d8df1'], ['#4ecdc4', '#6f9ceb'], ['#a04a8f', '#e5b23b'], ['#3a8fb0', '#1a2b33'], ['#e5b23b', '#4ecdc4'], ['#7c6fe0', '#1e1a36']];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 30,
      flexWrap: 'wrap',
      marginTop: 34,
      padding: '30px 34px',
      background: 'var(--bg-1)',
      borderRadius: 'var(--radius-xl)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 240px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      color: 'var(--fg-2)',
      marginBottom: 14
    }
  }, "Thousands of real viewers"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, avatars.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      marginLeft: i ? -12 : 0,
      background: `linear-gradient(135deg, ${a[0]}, ${a[1]})`,
      borderWidth: 2,
      borderStyle: 'solid',
      borderColor: 'var(--bg-1)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      marginLeft: -12,
      background: 'var(--bg-3)',
      borderWidth: 2,
      borderStyle: 'solid',
      borderColor: 'var(--bg-1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      font: '600 12px/1 var(--font-mono)',
      color: 'var(--fg-1)'
    }
  }, "+24k")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(StarRating, {
    value: 4.5,
    size: 20
  }))), /*#__PURE__*/React.createElement(Icon, {
    name: "caret-right",
    size: 26,
    color: "var(--fg-3)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 'none',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(ScoreRing, {
    score: 8.7,
    size: 104
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--fg-2)',
      marginTop: 12,
      maxWidth: 160
    }
  }, "One honest score, averaged from every rating.")));
}
function WhatIs({
  onNav
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1040,
      margin: '0 auto',
      padding: '0 28px 40px'
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '120px 0 96px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    className: "overline",
    style: {
      color: 'var(--teal-bright)',
      marginBottom: 26,
      letterSpacing: '0.16em'
    }
  }, "The Dreamwall Manifesto")), /*#__PURE__*/React.createElement(Reveal, {
    delay: 90
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: '700 clamp(44px, 7vw, 82px)/1.04 var(--font-display)',
      letterSpacing: '-0.025em',
      color: 'var(--fg-0)',
      margin: '0 auto',
      maxWidth: 880
    }
  }, "A home for films that were ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: 'var(--coral-bright)'
    }
  }, "dreamed"), " into being.")), /*#__PURE__*/React.createElement(Reveal, {
    delay: 180
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      font: '400 21px/1.6 var(--font-body)',
      color: 'var(--fg-1)',
      margin: '30px auto 0',
      maxWidth: 600
    }
  }, "Dreamwall is where AI-generated film and series are watched, rated, and taken seriously \u2014 by the people who actually watch them.")), /*#__PURE__*/React.createElement(Reveal, {
    delay: 260
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 13,
      justifyContent: 'center',
      marginTop: 40
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    onClick: () => onNav && onNav('Feed')
  }, "Enter the feed"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    onClick: () => onNav && onNav('Creators')
  }, "Meet the creators")))), /*#__PURE__*/React.createElement(ManifestoSection, {
    num: "01",
    kicker: "What it is",
    title: "A taste-driven home for a brand-new artform."
  }, /*#__PURE__*/React.createElement(Lead, null, "A generation of filmmakers is working in latent space \u2014 diffusion, text-to-video, hybrid live-action. Their work was scattered across feeds that were never built to hold it."), /*#__PURE__*/React.createElement(Lead, null, "Dreamwall gathers it in one place: a catalog you can browse, score, and argue about. Films, series, shorts, verticals \u2014 catalogued like the real cinema it is, with the people behind every render credited up front.")), /*#__PURE__*/React.createElement(ManifestoSection, {
    num: "02",
    kicker: "Why it exists",
    title: "Because \u201CAI-generated\u201D was never an insult.",
    accent: "var(--teal-bright)"
  }, /*#__PURE__*/React.createElement(Lead, null, "The tools changed. The instinct didn't. A great frame is still a great frame, whether it was shot on film or grown from a prompt at 3am."), /*#__PURE__*/React.createElement(Lead, null, "We built Dreamwall to give this work a serious place to live \u2014 somewhere a short made by one person on a laptop sits beside a studio's four-season epic, and both get judged on the only thing that matters: did it move you?")), /*#__PURE__*/React.createElement(ManifestoSection, {
    num: "03",
    kicker: "How ratings work",
    title: "Every score is earned, not generated."
  }, /*#__PURE__*/React.createElement(Lead, null, "This is the part people get wrong, so we'll be blunt: ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--fg-0)'
    }
  }, "there is no AI scoring system here."), " Nothing on this platform is judged by a machine."), /*#__PURE__*/React.createElement(Lead, null, "Every title's score is the plain average of ratings from real viewers \u2014 people who watched it and reached for the stars. More ratings, more honest the number. That's the whole mechanism. No black box."), /*#__PURE__*/React.createElement(RatingDiagram, null)), /*#__PURE__*/React.createElement(ManifestoSection, {
    num: "04",
    kicker: "How to join",
    title: "Watch. Rate. Or pick up the tools and make something.",
    accent: "var(--teal-bright)"
  }, /*#__PURE__*/React.createElement(Lead, null, "Anyone can join free, build a watchlist, and start rating. Follow the creators whose taste you trust and let the feed bring their next release to you."), /*#__PURE__*/React.createElement(Lead, null, "Made something yourself? Switch to a creator account, publish your work, and put it in front of an audience that's actually looking for it."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 13,
      flexWrap: 'wrap',
      marginTop: 30
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    onClick: () => onNav && onNav('Feed')
  }, "Create a free account"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "lg",
    onClick: () => onNav && onNav('Films')
  }, "Browse the catalog"))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '96px 0 120px',
      textAlign: 'center',
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("p", {
    style: {
      font: '400 italic 30px/1.4 var(--font-display)',
      fontStyle: 'italic',
      color: 'var(--fg-1)',
      margin: '0 auto',
      maxWidth: 680
    }
  }, "\u201CThe tools are new. The reason we make films is as old as firelight.\u201D"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    size: 18
  })))));
}
Object.assign(window, {
  WhatIs,
  Reveal,
  ManifestoSection,
  RatingDiagram
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/WhatIs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/admin-data.js
try { (() => {
// Dreamwall — Admin Panel mock data. Loaded after data.js + catalog-extra.js.
// Synthesizes users, activity, reports, content submissions, and time-series
// for the admin charts. All fictional.

// ---- platform-wide users (creators come from AICDB_CREATORS + a few viewers) ----
window.ADMIN_USERS = function () {
  const creatorUsers = (window.AICDB_CREATORS || []).map((c, i) => ({
    id: 'u-' + c.id,
    name: c.name,
    handle: c.handle,
    email: c.handle.replace('@', '') + '@aicdb.io',
    av: c.av,
    joined: ['2023-02-14', '2023-06-01', '2023-08-22', '2024-01-09', '2024-03-30', '2024-05-18', '2024-07-02', '2023-11-11', '2024-09-14', '2024-10-01', '2025-01-20'][i % 11],
    role: 'creator',
    verified: c.verified,
    works: window.AICDB_CREATOR_STATS ? window.AICDB_CREATOR_STATS(c).works : 0,
    banned: false
  }));
  const viewers = [{
    id: 'u-lena',
    name: 'Lena Reyes',
    handle: '@lenar',
    av: ['#d85a30', '#e5b23b'],
    joined: '2024-02-11',
    role: 'viewer',
    works: 0,
    banned: false
  }, {
    id: 'u-marco',
    name: 'Marco Vidal',
    handle: '@marcov',
    av: ['#9d8df1', '#d85a30'],
    joined: '2024-04-03',
    role: 'viewer',
    works: 0,
    banned: false
  }, {
    id: 'u-framek',
    name: 'theframekeeper',
    handle: '@framekeeper',
    av: ['#4ecdc4', '#6f9ceb'],
    joined: '2023-09-19',
    role: 'viewer',
    works: 0,
    banned: false
  }, {
    id: 'u-ada',
    name: 'Ada Vance',
    handle: '@adavance',
    av: ['#d85a30', '#9d8df1'],
    joined: '2024-01-02',
    role: 'admin',
    works: 0,
    banned: false
  }, {
    id: 'u-spam1',
    name: 'gen_spam_films',
    handle: '@genspam',
    av: ['#5a5e66', '#3a3d44'],
    joined: '2025-05-28',
    role: 'viewer',
    works: 0,
    banned: true,
    banReason: 'Spam submissions'
  }, {
    id: 'u-troll',
    name: 'rate_bomber',
    handle: '@ratebomber',
    av: ['#7a3a3a', '#3a1f1f'],
    joined: '2025-04-12',
    role: 'viewer',
    works: 0,
    banned: true,
    banReason: 'Rating manipulation'
  }, {
    id: 'u-quiet',
    name: 'quiet_watcher',
    handle: '@quietw',
    av: ['#3a8fb0', '#1a2b33'],
    joined: '2025-02-08',
    role: 'viewer',
    works: 0,
    banned: false
  }, {
    id: 'u-newby',
    name: 'first_frame',
    handle: '@firstframe',
    av: ['#e5b23b', '#4ecdc4'],
    joined: '2025-06-01',
    role: 'viewer',
    works: 0,
    banned: false
  }];
  viewers.forEach(v => {
    if (!v.email) v.email = v.handle.replace('@', '') + '@gmail.com';
  });
  return [...creatorUsers, ...viewers];
}();
window.ADMIN_USER_EMAILS = {};

// ---- content submissions queue (pending / published / rejected) ----
window.ADMIN_SUBMISSIONS = function () {
  // published = the live catalog
  const published = (window.AICDB_FILMS || []).map(f => ({
    id: f.id,
    title: f.title,
    creator: f.creator,
    type: f.type,
    g: f.g,
    score: f.score,
    ratings: f.ratings,
    status: 'published',
    date: (f.year || 2024) + '-0' + (1 + f.title.length % 9) + '-1' + f.title.length % 9
  }));
  // pending = brand-new submissions awaiting review (no score yet)
  const pending = [{
    id: 'p-tidewalkers',
    title: 'Tidewalkers',
    creator: 'Maya Okonkwo',
    type: 'movie',
    g: ['#0e2a2e', '#2f8f8a'],
    date: '2026-06-02',
    status: 'pending'
  }, {
    id: 'p-grainstudy7',
    title: 'Grain Study #7',
    creator: 'Maya Okonkwo',
    type: 'short',
    g: ['#2b2512', '#d0a93a'],
    date: '2026-06-01',
    status: 'pending'
  }, {
    id: 'p-thelongway',
    title: 'The Long Way Down',
    creator: '@nullframe',
    type: 'vertical',
    g: ['#241a3a', '#9d8df1'],
    date: '2026-05-31',
    status: 'pending'
  }, {
    id: 'p-saltmarsh',
    title: 'Saltmarsh',
    creator: 'Noor Farah',
    type: 'series',
    g: ['#10302d', '#3fae9f'],
    date: '2026-05-30',
    status: 'pending'
  }, {
    id: 'p-emberlight',
    title: 'Emberlight',
    creator: 'Bashir Halabi',
    type: 'movie',
    g: ['#2e1a14', '#c0653a'],
    date: '2026-05-29',
    status: 'pending'
  }, {
    id: 'p-nullcity',
    title: 'Null City',
    creator: 'Cosmic Pixel Co.',
    type: 'movie',
    g: ['#1a2b33', '#3a8fb0'],
    date: '2026-05-28',
    status: 'pending'
  }];
  // rejected = bounced submissions, with a reason
  const rejected = [{
    id: 'r-deepfake1',
    title: 'Untitled (Celebrity)',
    creator: '@genspam',
    type: 'movie',
    g: ['#3a3d44', '#5a5e66'],
    date: '2026-05-22',
    status: 'rejected',
    reason: 'Unauthorized likeness of a real person'
  }, {
    id: 'r-lowq',
    title: 'test test test',
    creator: '@firstframe',
    type: 'short',
    g: ['#262624', '#3a3a38'],
    date: '2026-05-20',
    status: 'rejected',
    reason: 'Low-effort / placeholder content'
  }, {
    id: 'r-dup',
    title: 'Redshift (re-upload)',
    creator: '@ratebomber',
    type: 'movie',
    g: ['#341512', '#e5484d'],
    date: '2026-05-18',
    status: 'rejected',
    reason: 'Duplicate of existing title'
  }];
  return [...pending, ...published, ...rejected];
}();

// ---- reports: content + comments ----
window.ADMIN_REPORTS = {
  content: [{
    id: 'rc1',
    target: 'Redshift (re-upload)',
    targetType: 'Movie',
    by: '@framekeeper',
    reason: 'Duplicate / re-upload of existing content',
    date: '2026-06-02',
    severity: 'medium'
  }, {
    id: 'rc2',
    target: 'Untitled (Celebrity)',
    targetType: 'Movie',
    by: '@lenar',
    reason: 'Uses a real person’s likeness without consent',
    date: '2026-06-01',
    severity: 'high'
  }, {
    id: 'rc3',
    target: 'Minute of Static',
    targetType: 'Vertical',
    by: '@quietw',
    reason: 'Disturbing imagery, missing content warning',
    date: '2026-05-30',
    severity: 'low'
  }, {
    id: 'rc4',
    target: 'Null City',
    targetType: 'Movie',
    by: '@marcov',
    reason: 'Suspected AI-model license violation',
    date: '2026-05-29',
    severity: 'medium'
  }],
  comments: [{
    id: 'rm1',
    target: '“This is the worst thing I’ve…”',
    targetType: 'Review on Redshift',
    by: '@marcov',
    reason: 'Harassment toward the creator',
    date: '2026-06-02',
    severity: 'high'
  }, {
    id: 'rm2',
    target: '“Rate this 1 star everyone, it…”',
    targetType: 'Comment on Saltwater Gods',
    by: '@lenar',
    reason: 'Organizing review-bombing',
    date: '2026-06-01',
    severity: 'high'
  }, {
    id: 'rm3',
    target: '“dm me for free prompt packs”',
    targetType: 'Comment on Glass Orchard',
    by: '@quietw',
    reason: 'Spam / self-promotion',
    date: '2026-05-31',
    severity: 'low'
  }]
};

// ---- bug reports submitted via the Feedback Flama (beta bug reporter) ----
window.ADMIN_BUG_REPORTS = [{
  id: 'bg1',
  by: '@lenar',
  page: 'Film detail',
  desc: 'Star rating control jumps back to 0 after I submit a half-star score — the value doesn’t stick on reload.',
  image: true,
  date: '2026-06-03'
}, {
  id: 'bg2',
  by: '@marcov',
  page: 'Feed',
  desc: 'Upvote count flickers and briefly shows the downvote total when I click fast.',
  image: false,
  date: '2026-06-03'
}, {
  id: 'bg3',
  by: '@framekeeper',
  page: 'Add Content',
  desc: 'Poster upload preview is stretched on the 2:3 dropzone — looks squished until I refresh.',
  image: true,
  date: '2026-06-02'
}, {
  id: 'bg4',
  by: '@quietw',
  page: 'Profile',
  desc: 'Followed Creators cards overflow the container on a narrow window and clip the Following button.',
  image: true,
  date: '2026-06-02'
}, {
  id: 'bg5',
  by: '@firstframe',
  page: 'Watchlist',
  desc: 'Removing a title from the hover rail removes the wrong row sometimes.',
  image: false,
  date: '2026-06-01'
}, {
  id: 'bg6',
  by: '@marcov',
  page: 'Creators',
  desc: 'Follow button on the featured creator stays on “Following” even after I unfollow and come back.',
  image: false,
  date: '2026-05-31'
}];

// ---- recent activity feed (dashboard) ----
window.ADMIN_ACTIVITY = [{
  kind: 'register',
  who: 'first_frame',
  detail: 'created an account',
  time: '4m ago',
  av: ['#e5b23b', '#4ecdc4']
}, {
  kind: 'submission',
  who: 'Maya Okonkwo',
  detail: 'submitted “Tidewalkers” for review',
  time: '22m ago',
  av: ['#d85a30', '#9d8df1']
}, {
  kind: 'report',
  who: 'theframekeeper',
  detail: 'reported “Redshift (re-upload)”',
  time: '38m ago',
  av: ['#4ecdc4', '#6f9ceb']
}, {
  kind: 'submission',
  who: '@nullframe',
  detail: 'submitted “The Long Way Down”',
  time: '1h ago',
  av: ['#9d8df1', '#d85a30']
}, {
  kind: 'register',
  who: 'quiet_watcher',
  detail: 'created an account',
  time: '2h ago',
  av: ['#3a8fb0', '#1a2b33']
}, {
  kind: 'report',
  who: 'lenar',
  detail: 'reported a comment on “Saltwater Gods”',
  time: '3h ago',
  av: ['#d85a30', '#e5b23b']
}, {
  kind: 'submission',
  who: 'Noor Farah',
  detail: 'submitted “Saltmarsh” for review',
  time: '5h ago',
  av: ['#a04a8f', '#e5b23b']
}, {
  kind: 'ban',
  who: 'rate_bomber',
  detail: 'was banned for rating manipulation',
  time: '6h ago',
  av: ['#7a3a3a', '#3a1f1f']
}, {
  kind: 'register',
  who: 'cinephile_22',
  detail: 'created an account',
  time: '8h ago',
  av: ['#6f9ceb', '#9d8df1']
}];

// ---- aggregate platform stats (dashboard cards) ----
window.ADMIN_STATS = {
  totalUsers: 128400,
  totalContent: window.AICDB_FILMS.length + 6,
  pendingReviews: window.ADMIN_SUBMISSIONS.filter(s => s.status === 'pending').length,
  activeToday: 18230,
  totalRatings: 1240000,
  reportedItems: window.ADMIN_REPORTS.content.length + window.ADMIN_REPORTS.comments.length
};

// ---- time series for charts ----
window.ADMIN_SERIES = function () {
  // 30 days of active users (with weekly rhythm) and new registrations
  const active = [],
    regs = [];
  let base = 14000;
  for (let i = 0; i < 30; i++) {
    const weekend = i % 7 === 5 || i % 7 === 6 ? 1.18 : 1;
    const trend = 1 + i * 0.012;
    const noise = 0.92 + i * 37 % 17 / 100;
    active.push(Math.round(base * weekend * trend * noise));
    regs.push(Math.round(120 + i * 6 + i * 53 % 19 * 11 * (weekend > 1 ? 1.3 : 1)));
  }
  return {
    active,
    regs
  };
}();

// ---- leaderboards ----
window.ADMIN_LEADERS = function () {
  const byViews = [...window.AICDB_FILMS].map(f => ({
    film: f,
    views: Math.round(window.AICDB_STAT(f).watched)
  })).sort((a, b) => b.views - a.views).slice(0, 6);
  const byRatings = [...window.AICDB_FILMS].map(f => ({
    film: f,
    rated: Math.round(window.AICDB_STAT(f).rated)
  })).sort((a, b) => b.rated - a.rated).slice(0, 6);
  const topCreators = [...(window.AICDB_CREATORS || [])].sort((a, b) => b.followers - a.followers).slice(0, 6);
  return {
    byViews,
    byRatings,
    topCreators
  };
}();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/admin-data.js", error: String((e && e.message) || e) }); }

// ui_kits/web-app/catalog-extra.js
try { (() => {
// Dreamwall — extended catalog + creators registry + social feed data.
// Loaded AFTER data.js. Expands AICDB_FILMS so the dedicated Films/Series
// browse pages feel full, and adds AICDB_CREATORS + AICDB_FEED.

// ---- season counts on the two existing series ----
(function () {
  const seasons = {
    'echoes-of-tomorrow': 3,
    'glass-orchard': 1
  };
  window.AICDB_FILMS.forEach(f => {
    if (seasons[f.id]) f.seasons = seasons[f.id];
  });
})();

// ---- additional titles ----
window.AICDB_FILMS.push(
// movies
{
  id: 'saltwater-gods',
  title: 'Saltwater Gods',
  type: 'movie',
  year: 2025,
  runtime: '141 min',
  score: 9.0,
  stars: 5,
  ratings: '33.4k',
  g: ['#0e2a2e', '#2f8f8a'],
  genres: ['Fantasy', 'Drama'],
  technique: 'Diffusion',
  creator: 'Maya Okonkwo',
  synopsis: 'A drowned pantheon wakes beneath a fishing town, and the only person who can hear them is the girl who stopped believing.'
}, {
  id: 'the-cartographer',
  title: 'The Cartographer',
  type: 'movie',
  year: 2025,
  runtime: '134 min',
  score: 8.9,
  stars: 4.5,
  ratings: '21.7k',
  g: ['#13212e', '#2f6f8f'],
  genres: ['Adventure', 'Fantasy'],
  technique: 'Hybrid Live-Action',
  creator: 'Nova Pictures',
  synopsis: 'A mapmaker is hired to chart a country that rearranges itself every night — and falls in love with a road that no longer exists.'
}, {
  id: 'mother-tongue',
  title: 'Mother Tongue',
  type: 'movie',
  year: 2024,
  runtime: '96 min',
  score: 8.5,
  stars: 4.5,
  ratings: '14.2k',
  g: ['#2c1a2e', '#a04a8f'],
  genres: ['Drama'],
  technique: 'Diffusion',
  creator: 'Noor Farah',
  synopsis: 'Three generations of women speak a private language no model can translate — until one tries.'
}, {
  id: 'vapor-trail',
  title: 'Vapor Trail',
  type: 'movie',
  year: 2025,
  runtime: '108 min',
  score: 7.7,
  stars: 4,
  ratings: '8.9k',
  g: ['#1a2b33', '#3a8fb0'],
  genres: ['Sci-Fi', 'Drama'],
  technique: 'Text-to-Video',
  creator: 'Selma Reyes',
  synopsis: 'A test pilot keeps outliving her own flights. Quiet science fiction about loud, unfinished feelings.'
}, {
  id: 'eclipse-theory',
  title: 'Eclipse Theory',
  type: 'movie',
  year: 2023,
  runtime: '119 min',
  score: 6.9,
  stars: 3.5,
  ratings: '7.1k',
  g: ['#2a2412', '#b08a2f'],
  genres: ['Thriller', 'Sci-Fi'],
  technique: 'Diffusion',
  creator: 'Cosmic Pixel Co.',
  synopsis: 'During a 7-minute eclipse, every clock on Earth runs backwards — and a detective gets exactly that long to prevent a murder.'
},
// series
{
  id: 'the-quiet-sequence',
  title: 'The Quiet Sequence',
  type: 'series',
  year: 2025,
  runtime: '4 seasons',
  seasons: 4,
  score: 8.6,
  stars: 4.5,
  ratings: '40.2k',
  g: ['#10302d', '#3fae9f'],
  genres: ['Drama'],
  technique: 'Hybrid Live-Action',
  creator: 'The Vale Collective',
  synopsis: 'A monastery of sound engineers records the last quiet places on Earth before they vanish. Four seasons, almost no dialogue.'
}, {
  id: 'nightvale-frequencies',
  title: 'Nightvale Frequencies',
  type: 'series',
  year: 2024,
  runtime: '2 seasons',
  seasons: 2,
  score: 8.2,
  stars: 4,
  ratings: '17.5k',
  g: ['#1e1530', '#6b5bd0'],
  genres: ['Mystery', 'Horror'],
  technique: 'Diffusion',
  creator: 'Theo Vance',
  synopsis: 'A pirate radio host broadcasts to a town that may not exist. Every caller knows something they shouldn\u2019t.'
}, {
  id: 'hollow-sun',
  title: 'Hollow Sun',
  type: 'series',
  year: 2025,
  runtime: '2 seasons',
  seasons: 2,
  score: 7.4,
  stars: 3.5,
  ratings: '11.0k',
  g: ['#2e1a14', '#c0653a'],
  genres: ['Western', 'Sci-Fi'],
  technique: 'Diffusion',
  creator: 'Bashir Halabi',
  synopsis: 'A frontier town orbits a dying star. The sheriff is the only one who remembers it used to give light.'
}, {
  id: 'margin-of-error',
  title: 'Margin of Error',
  type: 'series',
  year: 2024,
  runtime: '1 season',
  seasons: 1,
  score: 7.8,
  stars: 4,
  ratings: '9.3k',
  g: ['#1c2433', '#4a73b0'],
  genres: ['Comedy', 'Drama'],
  technique: 'Text-to-Video',
  creator: 'Selma Reyes',
  synopsis: 'The world\u2019s worst quality-assurance team tests reality itself. Every bug they find rewrites a life.'
},
// shorts
{
  id: 'tin-halo',
  title: 'Tin Halo',
  type: 'short',
  year: 2025,
  runtime: '8 min',
  score: 8.1,
  stars: 4,
  ratings: '5.4k',
  g: ['#2b2512', '#d0a93a'],
  genres: ['Animation', 'Drama'],
  technique: 'Frame Interp.',
  creator: 'Ito Render Lab',
  synopsis: 'A scrapyard angel earns its wings one rusted feather at a time. Eight minutes, no dialogue, all light.'
}, {
  id: 'bottle-episode',
  title: 'Bottle Episode',
  type: 'short',
  year: 2024,
  runtime: '14 min',
  score: 7.0,
  stars: 3.5,
  ratings: '3.8k',
  g: ['#241a1a', '#9a5a5a'],
  genres: ['Drama'],
  technique: 'Text-to-Video',
  creator: '@nullframe',
  synopsis: 'Two strangers, one stalled subway car, fourteen real-time minutes. Shot vertical, built for the scroll.'
});

// ---- creators registry. `name` matches film.creator strings so works/score derive at runtime ----
window.AICDB_CREATORS = [{
  id: 'vale',
  name: 'The Vale Collective',
  handle: '@thevale',
  av: ['#4ecdc4', '#6f9ceb'],
  followers: 92400,
  verified: true,
  location: 'Remote',
  tagline: 'A six-person studio building generation-spanning epics in latent space.'
}, {
  id: 'maya',
  name: 'Maya Okonkwo',
  handle: '@mayaokonkwo',
  av: ['#d85a30', '#9d8df1'],
  followers: 48200,
  verified: true,
  location: 'Lagos \u00b7 Berlin',
  tagline: "I don't generate films \u2014 I haunt them into existence."
}, {
  id: 'nova',
  name: 'Nova Pictures',
  handle: '@novapictures',
  av: ['#2f6f8f', '#4ecdc4'],
  followers: 54800,
  verified: true,
  location: 'Reykjav\u00edk',
  tagline: "Maps to places that don't exist yet."
}, {
  id: 'theo',
  name: 'Theo Vance',
  handle: '@theovance',
  av: ['#6b5bd0', '#9d8df1'],
  followers: 38900,
  verified: true,
  location: 'Manchester',
  tagline: "Frequencies you can't unhear."
}, {
  id: 'noor',
  name: 'Noor Farah',
  handle: '@noorfarah',
  av: ['#a04a8f', '#e5b23b'],
  followers: 31800,
  verified: true,
  location: 'Amman',
  tagline: 'Botanist turned showrunner. I grow stories the way orchards grow fruit.'
}, {
  id: 'bashir',
  name: 'Bashir Halabi',
  handle: '@bashirhalabi',
  av: ['#c44a2a', '#e5b23b'],
  followers: 27600,
  verified: true,
  location: 'Beirut',
  tagline: 'One perfect frame at a time. Patience is my render farm.'
}, {
  id: 'ito',
  name: 'Ito Render Lab',
  handle: '@itorenderlab',
  av: ['#e5b23b', '#4ecdc4'],
  followers: 22300,
  verified: true,
  location: 'Kyoto',
  tagline: 'Wordless miniatures. The light touches the smallest things first.'
}, {
  id: 'nullframe',
  name: '@nullframe',
  handle: '@nullframe',
  av: ['#9d8df1', '#d85a30'],
  followers: 64100,
  verified: false,
  location: 'Online',
  tagline: 'Built for the scroll. Sixty floors, one minute, no mercy.'
}, {
  id: 'cosmic',
  name: 'Cosmic Pixel Co.',
  handle: '@cosmicpixel',
  av: ['#e5484d', '#6f9ceb'],
  followers: 18900,
  verified: false,
  location: 'Austin',
  tagline: 'Genre-fluid pixel pushers. We chase stars that run away.'
}, {
  id: 'selma',
  name: 'Selma Reyes',
  handle: '@selmareyes',
  av: ['#3a8fb0', '#1a2b33'],
  followers: 12700,
  verified: false,
  location: 'Lisbon',
  tagline: 'Quiet sci-fi about loud feelings.'
}, {
  id: 'deadair',
  name: '@deadair',
  handle: '@deadair',
  av: ['#7c6fe0', '#1e1a36'],
  followers: 15200,
  verified: false,
  location: 'Unknown',
  tagline: 'At 3:33 the static learns your face.'
}];
window.AICDB_CREATOR_BY_NAME = {};
window.AICDB_CREATORS.forEach(c => {
  window.AICDB_CREATOR_BY_NAME[c.name] = c;
});

// derived per-creator stats from the catalog
window.AICDB_CREATOR_STATS = function (creator) {
  const works = window.AICDB_FILMS.filter(f => f.creator === creator.name);
  const avg = works.length ? works.reduce((s, f) => s + f.score, 0) / works.length : 0;
  return {
    works: works.length,
    avg,
    films: works
  };
};

// ---- social feed: posts from creators (newest first) ----
window.AICDB_FEED = [{
  id: 'p1',
  creator: 'maya',
  time: '2h',
  kind: 'upload',
  film: 'saltwater-gods',
  text: 'Three years in latent space. <b>Saltwater Gods</b> is finally live. Go drown in it. \u{1F30A}',
  likes: 1240,
  comments: 89,
  reposts: 142
}, {
  id: 'p2',
  creator: 'vale',
  time: '5h',
  kind: 'text',
  text: 'Season 4 of The Quiet Sequence wrapped today. We\u2019re exhausted and we already miss it. Thank you to everyone who rated S3 \u2014 your notes literally shaped the finale.',
  likes: 980,
  comments: 64,
  reposts: 51
}, {
  id: 'p3',
  creator: 'noor',
  time: '8h',
  kind: 'rating',
  film: 'the-cartographer',
  stars: 4.5,
  text: 'Nova Pictures did something extraordinary here. The map sequence alone is worth your whole evening.',
  likes: 412,
  comments: 23,
  reposts: 18
}, {
  id: 'p4',
  creator: 'bashir',
  time: '11h',
  kind: 'text',
  mention: 'the-long-render',
  text: 'Unpopular opinion: a high score was never the goal. A single frame someone still remembers ten years from now \u2014 that\u2019s the whole job.',
  likes: 1510,
  comments: 203,
  reposts: 188
}, {
  id: 'p5',
  creator: 'theo',
  time: '14h',
  kind: 'list',
  listTitle: 'Late Night Static',
  listFilms: ['minute-of-static', 'nightvale-frequencies', 'hollow-sun', 'sixty-seconds-down'],
  text: 'A playlist for 3am. Don\u2019t say I didn\u2019t warn you.',
  likes: 523,
  comments: 37,
  reposts: 44
}, {
  id: 'p6',
  creator: 'nullframe',
  time: '18h',
  kind: 'upload',
  film: 'bottle-episode',
  text: 'new drop. 14 minutes this time. i\u2019m growing.',
  likes: 660,
  comments: 41,
  reposts: 30
}, {
  id: 'p7',
  creator: 'ito',
  time: '1d',
  kind: 'upload',
  film: 'tin-halo',
  text: 'Tin Halo \u2014 8 minutes, no dialogue, all light. Headphones on, lights off.',
  likes: 388,
  comments: 19,
  reposts: 22
}, {
  id: 'p8',
  creator: 'maya',
  time: '1d',
  kind: 'rating',
  film: 'echoes-of-tomorrow',
  stars: 5,
  text: 'Rewatched the entire thing the night before my own premiere. Still the bar. Forever the bar. @thevale',
  likes: 734,
  comments: 52,
  reposts: 61
}, {
  id: 'p9',
  creator: 'nova',
  time: '2d',
  kind: 'text',
  text: 'Prepping something big for next quarter. If you\u2019ve trained a coastline model you\u2019re proud of, my inbox is open. No coastlines too small.',
  likes: 295,
  comments: 28,
  reposts: 12
}];
window.AICDB_FILM_BY_ID = {};
window.AICDB_FILMS.forEach(f => {
  window.AICDB_FILM_BY_ID[f.id] = f;
});

// ---- editorial "Staff Pick" flags (hand-picked) ----
['echoes-of-tomorrow', 'saltwater-gods', 'mother-tongue'].forEach(id => {
  if (window.AICDB_FILM_BY_ID[id]) window.AICDB_FILM_BY_ID[id].staffPick = true;
});

// numeric rating count from a film's "24.1k" style string
window.AICDB_RATING_NUM = function (film) {
  const s = String(film.ratings);
  return parseFloat(s) * (s.includes('M') ? 1e6 : s.includes('k') ? 1e3 : 1);
};

// content ribbon: 'staff' (editorially picked) or 'gem' (auto: low-view + high-rated)
window.AICDB_RIBBON = function (film) {
  if (film.staffPick) return 'staff';
  if (window.AICDB_RATING_NUM(film) < 9000 && film.score >= 8.0) return 'gem';
  return null;
};

// similar titles for "More like this": shared genre/type, then by score, excluding self
window.AICDB_SIMILAR = function (film, n) {
  const overlap = f => f.genres.filter(g => film.genres.includes(g)).length;
  return window.AICDB_FILMS.filter(f => f.id !== film.id).map(f => ({
    f,
    s: overlap(f) * 10 + (f.type === film.type ? 4 : 0) + f.score
  })).sort((a, b) => b.s - a.s).slice(0, n || 6).map(x => x.f);
};

// footer / settings link groundwork — full supported-language registry
window.AICDB_LANGUAGES = [{
  code: 'EN',
  name: 'English',
  native: 'English'
}, {
  code: 'TR',
  name: 'Turkish',
  native: 'T\u00fcrk\u00e7e'
}, {
  code: 'ES',
  name: 'Spanish',
  native: 'Espa\u00f1ol'
}, {
  code: 'FR',
  name: 'French',
  native: 'Fran\u00e7ais'
}, {
  code: 'DE',
  name: 'German',
  native: 'Deutsch'
}, {
  code: 'PT',
  name: 'Portuguese',
  native: 'Portugu\u00eas'
}, {
  code: 'AR',
  name: 'Arabic',
  native: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629'
}, {
  code: 'HI',
  name: 'Hindi',
  native: '\u0939\u093f\u0928\u094d\u0926\u0940'
}, {
  code: 'JA',
  name: 'Japanese',
  native: '\u65e5\u672c\u8a9e'
}, {
  code: 'KO',
  name: 'Korean',
  native: '\ud55c\uad6d\uc5b4'
}, {
  code: 'ZH',
  name: 'Chinese (Simplified)',
  native: '\u7b80\u4f53\u4e2d\u6587'
}, {
  code: 'RU',
  name: 'Russian',
  native: '\u0420\u0443\u0441\u0441\u043a\u0438\u0439'
}, {
  code: 'IT',
  name: 'Italian',
  native: 'Italiano'
}, {
  code: 'NL',
  name: 'Dutch',
  native: 'Nederlands'
}, {
  code: 'PL',
  name: 'Polish',
  native: 'Polski'
}, {
  code: 'SV',
  name: 'Swedish',
  native: 'Svenska'
}, {
  code: 'NO',
  name: 'Norwegian',
  native: 'Norsk'
}, {
  code: 'DA',
  name: 'Danish',
  native: 'Dansk'
}, {
  code: 'FI',
  name: 'Finnish',
  native: 'Suomi'
}, {
  code: 'EL',
  name: 'Greek',
  native: '\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac'
}, {
  code: 'HE',
  name: 'Hebrew',
  native: '\u05e2\u05d1\u05e8\u05d9\u05ea'
}, {
  code: 'ID',
  name: 'Indonesian',
  native: 'Bahasa Indonesia'
}, {
  code: 'MS',
  name: 'Malay',
  native: 'Bahasa Melayu'
}, {
  code: 'TH',
  name: 'Thai',
  native: '\u0e44\u0e17\u0e22'
}, {
  code: 'VI',
  name: 'Vietnamese',
  native: 'Ti\u1ebfng Vi\u1ec7t'
}, {
  code: 'UK',
  name: 'Ukrainian',
  native: '\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430'
}];
// short code list (kept for back-compat with existing selectors)
window.AICDB_LANGS = window.AICDB_LANGUAGES.map(l => l.code);
window.AICDB_LANG_BY_CODE = {};
window.AICDB_LANGUAGES.forEach(l => {
  window.AICDB_LANG_BY_CODE[l.code] = l;
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/catalog-extra.js", error: String((e && e.message) || e) }); }

// ui_kits/web-app/data.js
try { (() => {
// Dreamwall — sample catalog data for the UI kit (fictional titles)
window.AICDB_TYPES = {
  movie: {
    label: 'Movie',
    color: 'var(--type-movie)',
    ghost: 'var(--type-movie-ghost)',
    text: 'var(--type-movie-text)',
    icon: 'film'
  },
  series: {
    label: 'Series',
    color: 'var(--type-series)',
    ghost: 'var(--type-series-ghost)',
    text: 'var(--type-series-text)',
    icon: 'tv'
  },
  short: {
    label: 'Short',
    color: 'var(--type-short)',
    ghost: 'var(--type-short-ghost)',
    text: 'var(--type-short-text)',
    icon: 'clapperboard'
  },
  vertical: {
    label: 'Vertical',
    color: 'var(--type-vertical)',
    ghost: 'var(--type-vertical-ghost)',
    text: 'var(--type-vertical-text)',
    icon: 'smartphone'
  }
};
window.AICDB_FILMS = [{
  id: 'synthetic-dreams',
  title: 'Synthetic Dreams',
  type: 'movie',
  year: 2025,
  runtime: '142 min',
  score: 8.7,
  stars: 4.5,
  ratings: '24.1k',
  g: ['#3a2118', '#d85a30'],
  genres: ['Sci-Fi', 'Neo-Noir'],
  technique: 'Diffusion',
  creator: 'Maya Okonkwo',
  synopsis: 'A memory-broker in a rain-slicked megacity discovers the dreams she sells are bleeding into a shared reality no one can switch off.'
}, {
  id: 'echoes-of-tomorrow',
  title: 'Echoes of Tomorrow',
  type: 'series',
  year: 2024,
  runtime: '3 seasons',
  score: 9.1,
  stars: 5,
  ratings: '58.3k',
  g: ['#10302d', '#4ecdc4'],
  genres: ['Sci-Fi', 'Drama'],
  technique: 'Hybrid Live-Action',
  creator: 'The Vale Collective',
  synopsis: 'Across three timelines, a family keeps almost meeting itself. An aching, generation-spanning epic rendered entirely in latent space.'
}, {
  id: 'paper-suns',
  title: 'Paper Suns',
  type: 'short',
  year: 2025,
  runtime: '11 min',
  score: 7.9,
  stars: 4,
  ratings: '6.2k',
  g: ['#332a12', '#e5b23b'],
  genres: ['Animation'],
  technique: 'Frame Interp.',
  creator: 'Ito Render Lab',
  synopsis: 'A folded-paper world unfurls at dawn. A wordless miniature about the things light touches first.'
}, {
  id: 'sixty-seconds-down',
  title: 'Sixty Seconds Down',
  type: 'vertical',
  year: 2025,
  runtime: '1 min',
  score: 7.2,
  stars: 3.5,
  ratings: '12.8k',
  g: ['#241a3a', '#9d8df1'],
  genres: ['Thriller'],
  technique: 'Text-to-Video',
  creator: '@nullframe',
  synopsis: 'An elevator. A stranger. Sixty floors. Shot for the phone, built for the scroll.'
}, {
  id: 'the-long-render',
  title: 'The Long Render',
  type: 'movie',
  year: 2024,
  runtime: '128 min',
  score: 8.3,
  stars: 4,
  ratings: '19.4k',
  g: ['#2a1410', '#c44a2a'],
  genres: ['Drama'],
  technique: 'Diffusion',
  creator: 'Bashir Halabi',
  synopsis: 'A reclusive director spends a decade generating a single perfect frame — and loses everyone who waited for it.'
}, {
  id: 'glass-orchard',
  title: 'Glass Orchard',
  type: 'series',
  year: 2025,
  runtime: '1 season',
  score: 8.8,
  stars: 4.5,
  ratings: '31.0k',
  g: ['#0f2e2b', '#3aa9a1'],
  genres: ['Mystery', 'Drama'],
  technique: 'Hybrid Live-Action',
  creator: 'Noor Farah',
  synopsis: 'In a town where the trees grow glass fruit, a botanist investigates why the harvest has started showing faces.'
}, {
  id: 'redshift',
  title: 'Redshift',
  type: 'movie',
  year: 2025,
  runtime: '117 min',
  score: 6.4,
  stars: 3,
  ratings: '9.7k',
  g: ['#341512', '#e5484d'],
  genres: ['Sci-Fi', 'Action'],
  technique: 'Diffusion',
  creator: 'Cosmic Pixel Co.',
  synopsis: 'A salvage crew chases a derelict generation-ship toward a star that is moving away faster than light should allow.'
}, {
  id: 'minute-of-static',
  title: 'Minute of Static',
  type: 'vertical',
  year: 2024,
  runtime: '1 min',
  score: 7.6,
  stars: 4,
  ratings: '15.2k',
  g: ['#1e1a36', '#7c6fe0'],
  genres: ['Horror'],
  technique: 'Text-to-Video',
  creator: '@deadair',
  synopsis: 'Every night at 3:33 the channel cuts to static — and something on the other side is learning to look back.'
}];

// Watchlist store — shared across pages, persisted to localStorage.
window.AICDB_WATCHLIST = function () {
  const KEY = 'aicdb_watchlist';
  let ids;
  try {
    ids = JSON.parse(localStorage.getItem(KEY) || '["glass-orchard","redshift"]');
  } catch (e) {
    ids = ['glass-orchard', 'redshift'];
  }
  const subs = new Set();
  function emit() {
    try {
      localStorage.setItem(KEY, JSON.stringify(ids));
    } catch (e) {}
    subs.forEach(fn => fn(ids));
  }
  return {
    get: () => ids,
    has: id => ids.includes(id),
    toggle: id => {
      ids = ids.includes(id) ? ids.filter(x => x !== id) : [id, ...ids];
      emit();
    },
    subscribe: fn => {
      subs.add(fn);
      return () => subs.delete(fn);
    }
  };
}();

// Creator accounts the (signed-in) user has created. Empty by default — the
// user starts with no creator account. Shared across pages via localStorage.
window.AICDB_CREATOR_ACCOUNTS = function () {
  const KEY = 'aicdb_creator_accounts';
  let list;
  try {
    list = JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch (e) {
    list = [];
  }
  if (!Array.isArray(list)) list = [];
  const subs = new Set();
  function emit() {
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch (e) {}
    subs.forEach(fn => fn(list));
  }
  return {
    get: () => list,
    count: () => list.length,
    byId: id => list.find(a => a.id === id) || null,
    add: acct => {
      const id = acct.id || 'ca-' + Date.now().toString(36);
      const rec = {
        id,
        showOnProfile: true,
        ...acct
      };
      list = [...list, rec];
      emit();
      return rec;
    },
    update: (id, patch) => {
      list = list.map(a => a.id === id ? {
        ...a,
        ...patch
      } : a);
      emit();
    },
    remove: id => {
      list = list.filter(a => a.id !== id);
      emit();
    },
    subscribe: fn => {
      subs.add(fn);
      return () => subs.delete(fn);
    }
  };
}();

// the signed-in user's main (viewer) account — shown atop the creator-setup page
window.AICDB_MAIN_ACCOUNT = {
  name: 'Ada Vance',
  handle: '@adavance',
  avatar: ['#d85a30', '#9d8df1'],
  joined: 'Joined March 2024'
};

// Signed-in viewer stats. `loggedTitles` gates power-user features (e.g. the
// uniqueness/Sıradışılık rating, which needs 1000+ logged titles to access).
window.AICDB_VIEWER = {
  loggedTitles: 1240
};
window.AICDB_UNIQUENESS_MIN_LOGGED = 1000;

// Per-title detail metadata — quotes, series counts, crew, production, "extraordinary" meter.
window.AICDB_DETAILS = {
  'synthetic-dreams': {
    quote: 'Every dream I sell is a door someone forgets to close.',
    extraordinary: 78,
    budget: '$2.4M',
    duration: '14 months',
    contributors: 38,
    models: ['Diffusion v6', 'VoxSynth 2', 'ToneField'],
    crew: [['Direction', 'Maya Okonkwo'], ['Prompt Architect', 'Yuki Tanaka'], ['Model Supervisor', 'Dapo Okafor'], ['Sound Design', 'Lena Sørensen'], ['Voice Synthesis', 'Atlas Voices'], ['Edit & Compositing', 'Reva Mehta']]
  },
  'echoes-of-tomorrow': {
    seasons: 3,
    episodes: 24,
    quote: 'We keep almost meeting ourselves — and almost is its own kind of forever.',
    extraordinary: 91,
    budget: '$11.8M',
    duration: '2 years',
    contributors: 84,
    models: ['Hybrid-Render X', 'VoxSynth 3', 'MotionField Pro', 'NeRF-Live'],
    crew: [['Showrunner', 'The Vale Collective'], ['Prompt Architect', 'Iris Calloway'], ['Model Supervisor', 'Theo Vance'], ['Sound Design', 'Marisol Reyes'], ['Voice Cast', 'Live + Synth Ensemble'], ['Continuity AI', 'Juno Park']]
  },
  'paper-suns': {
    quote: 'The light always touches the smallest things first.',
    extraordinary: 64,
    budget: '$180k',
    duration: '5 months',
    contributors: 9,
    models: ['FrameInterp 4', 'PaperGAN'],
    crew: [['Direction', 'Ito Render Lab'], ['Animation Lead', 'Kenji Aoyama'], ['Prompt Architect', 'Mira Sato'], ['Sound Design', 'Field & Fold'], ['Score', 'Hana Vermeer']]
  },
  'sixty-seconds-down': {
    quote: 'Sixty floors. One of us is not getting off.',
    extraordinary: 52,
    budget: '$45k',
    duration: '6 weeks',
    contributors: 5,
    models: ['Text-to-Video 3', 'VoxSynth 2'],
    crew: [['Direction', '@nullframe'], ['Prompt Architect', 'D. Reyes'], ['Sound Design', 'Nullroom'], ['Voice Synthesis', 'Atlas Voices']]
  },
  'the-long-render': {
    quote: 'A perfect frame costs you every imperfect year.',
    extraordinary: 83,
    budget: '$3.1M',
    duration: '4 years',
    contributors: 27,
    models: ['Diffusion v6', 'ToneField', 'GrainEngine'],
    crew: [['Direction', 'Bashir Halabi'], ['Prompt Architect', 'Selin Aydın'], ['Model Supervisor', 'M. Costa'], ['Sound Design', 'Halabi Audio'], ['Edit & Compositing', 'Noa Frank']]
  },
  'glass-orchard': {
    seasons: 1,
    episodes: 8,
    quote: 'The fruit grows faces because the orchard remembers.',
    extraordinary: 74,
    budget: '$6.4M',
    duration: '18 months',
    contributors: 52,
    models: ['Hybrid-Render X', 'VoxSynth 3', 'BotanyGAN'],
    crew: [['Showrunner', 'Noor Farah'], ['Prompt Architect', 'Eli Brandt'], ['Model Supervisor', 'S. Aziz'], ['Sound Design', 'Orchard Foley'], ['Voice Cast', 'Live Ensemble'], ['Edit & Compositing', 'Dana Wu']]
  },
  'redshift': {
    quote: 'The star is running. So are we.',
    extraordinary: 47,
    budget: '$2.0M',
    duration: '11 months',
    contributors: 31,
    models: ['Diffusion v6', 'MotionField Pro'],
    crew: [['Direction', 'Cosmic Pixel Co.'], ['Prompt Architect', 'V. Sokolov'], ['Model Supervisor', 'R. Okonjo'], ['Sound Design', 'Pixel Audio'], ['Voice Synthesis', 'Atlas Voices']]
  },
  'minute-of-static': {
    quote: 'At 3:33 the static learns your face.',
    extraordinary: 69,
    budget: '$30k',
    duration: '4 weeks',
    contributors: 4,
    models: ['Text-to-Video 3', 'GrainEngine'],
    crew: [['Direction', '@deadair'], ['Prompt Architect', 'K. Mraz'], ['Sound Design', 'Dead Air Foley']]
  }
};

// Derived community stats for a title (from its rating count).
window.AICDB_STAT = function (film) {
  const n = parseFloat(String(film.ratings)) * (String(film.ratings).includes('k') ? 1000 : 1);
  return {
    watched: n * 6.2,
    favorited: n * 0.42,
    watchlisted: n * 0.85,
    rated: n,
    completion: 0.78 + (film.score - 7) * 0.03
  };
};
window.AICDB_REVIEWS = [{
  user: 'Lena R.',
  av: ['#d85a30', '#e5b23b'],
  stars: 5,
  when: '2 days ago',
  likes: 142,
  body: "The diffusion grain isn't a limitation here — it's the whole point. Every frame looks like a half-remembered dream. Stunning."
}, {
  user: 'theframekeeper',
  av: ['#4ecdc4', '#6f9ceb'],
  stars: 4,
  when: '1 week ago',
  likes: 88,
  body: "Ambitious to a fault. The middle act loses the plot in its own latent space, but that final render is worth the price of admission."
}, {
  user: 'Marco V.',
  av: ['#9d8df1', '#d85a30'],
  stars: 4.5,
  when: '2 weeks ago',
  likes: 54,
  body: "Proof that 'AI-generated' and 'has a soul' aren't mutually exclusive. I've rewatched the rooftop sequence five times."
}];
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/data.js", error: String((e && e.message) || e) }); }

// ui_kits/web-app/theme-init.js
try { (() => {
// Dreamwall — theme bootstrap. Plain JS, loaded synchronously in <head> so the
// correct theme is on <html> before first paint (no flash). Reads the persisted
// preference, maps legacy + System values, and toggles data-theme="solarpunk".
(function () {
  function resolve(t) {
    if (t === 'System') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'Solarpunk' : 'Cyberpunk';
    }
    if (t === 'Light') return 'Solarpunk'; // legacy
    if (t === 'Dark') return 'Cyberpunk'; // legacy
    return t || 'Cyberpunk';
  }
  function apply(theme) {
    var t = resolve(theme);
    var root = document.documentElement;
    if (t === 'Solarpunk') root.setAttribute('data-theme', 'solarpunk');else root.removeAttribute('data-theme');
  }
  // expose for live switching from Preferences
  window.AICDB_applyTheme = apply;
  try {
    var prefs = JSON.parse(localStorage.getItem('aicdb_prefs') || '{}');
    apply(prefs.theme);
  } catch (e) {
    apply('Cyberpunk');
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/theme-init.js", error: String((e && e.message) || e) }); }

})();
