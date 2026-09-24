'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  Check,
  Search,
  Filter,
  Sparkles,
  BookOpen,
  User,
  Image as ImageIcon,
  ArrowUpRight,
  Sliders,
  Layers,
  Clock,
  ArrowLeft,
  X,
  FileText,
  MessageSquare,
  Bookmark,
  Share2
} from 'lucide-react';
import { MOCK_ARTICLES, MOCK_AUTHORS, CATEGORIES } from '@/data/mockArticles';
import { Article, CategorySlug } from '@/types/editorial';

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
  const [activeTab, setActiveTab] = useState<'articles' | 'composer' | 'curation' | 'authors'>('articles');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Edit / Composer State
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDek, setFormDek] = useState('');
  const [formCategory, setFormCategory] = useState<CategorySlug>('fashion');
  const [formType, setFormType] = useState<'standard' | 'feature' | 'interview'>('standard');
  const [formAuthorId, setFormAuthorId] = useState('camille-laurent');
  const [formCoverUrl, setFormCoverUrl] = useState('');
  const [formCoverCaption, setFormCoverCaption] = useState('');
  const [formReadTime, setFormReadTime] = useState('6 min read');
  const [formTags, setFormTags] = useState('');
  const [formParagraph1, setFormParagraph1] = useState('');
  const [formQuote, setFormQuote] = useState('');
  const [formQuoteAttribution, setFormQuoteAttribution] = useState('');
  
  // Interview specific fields
  const [formSubjectName, setFormSubjectName] = useState('');
  const [formSubjectTitle, setFormSubjectTitle] = useState('');
  const [formKeyQuote, setFormKeyQuote] = useState('');

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Open Composer for new story
  const handleOpenNewStory = () => {
    setEditingArticleId(null);
    setFormTitle('');
    setFormDek('');
    setFormCategory('fashion');
    setFormType('standard');
    setFormAuthorId('camille-laurent');
    setFormCoverUrl('https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=85&w=1600');
    setFormCoverCaption('Atelier study in natural light.');
    setFormReadTime('5 min read');
    setFormTags('Fashion, Couture, Atelier');
    setFormParagraph1('An exploration of contemporary silhouettes and tactile weight in modern dressmaking.');
    setFormQuote('Elegance is the quiet discipline of self-possession.');
    setFormQuoteAttribution('Editorial Note');
    setFormSubjectName('');
    setFormSubjectTitle('');
    setFormKeyQuote('');
    setActiveTab('composer');
  };

  // Open Composer for existing story
  const handleEditStory = (art: Article) => {
    setEditingArticleId(art.id);
    setFormTitle(art.title);
    setFormDek(art.dek);
    setFormCategory(art.category);
    setFormType(art.type);
    setFormAuthorId(art.author.id);
    setFormCoverUrl(art.coverImage.url);
    setFormCoverCaption(art.coverImage.caption || '');
    setFormReadTime(art.readTime);
    setFormTags(art.tags.join(', '));
    
    // Find text paragraphs & quote
    const firstP = art.content.find((b) => b.type === 'paragraph');
    setFormParagraph1(firstP && firstP.type === 'paragraph' ? firstP.text : '');
    const firstQ = art.content.find((b) => b.type === 'quote');
    setFormQuote(firstQ && firstQ.type === 'quote' ? firstQ.quote : '');
    setFormQuoteAttribution(firstQ && firstQ.type === 'quote' ? firstQ.attribution || '' : '');

    if (art.interview) {
      setFormSubjectName(art.interview.subjectName);
      setFormSubjectTitle(art.interview.subjectTitle);
      setFormKeyQuote(art.interview.keyQuote);
    } else {
      setFormSubjectName('');
      setFormSubjectTitle('');
      setFormKeyQuote('');
    }

    setActiveTab('composer');
  };

  // Save story from Composer
  const handleSaveStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('Please provide an article title');
      return;
    }

    const authorObj =
      Object.values(MOCK_AUTHORS).find((a) => a.id === formAuthorId) ||
      MOCK_AUTHORS.camille;

    const categoryObj = CATEGORIES.find((c) => c.slug === formCategory);

    const slug =
      editingArticleId
        ? articles.find((a) => a.id === editingArticleId)?.slug || formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        : formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const updatedTags = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingArticleId) {
      // Update existing
      setArticles((prev) =>
        prev.map((art) => {
          if (art.id === editingArticleId) {
            return {
              ...art,
              title: formTitle,
              dek: formDek,
              category: formCategory,
              categoryLabel: categoryObj?.label || 'Feature',
              type: formType,
              readTime: formReadTime,
              author: authorObj,
              tags: updatedTags.length > 0 ? updatedTags : art.tags,
              coverImage: {
                ...art.coverImage,
                url: formCoverUrl || art.coverImage.url,
                caption: formCoverCaption,
              },
              content: [
                { type: 'paragraph', text: formParagraph1, dropCap: true },
                ...(formQuote
                  ? ([
                      {
                        type: 'quote',
                        quote: formQuote,
                        attribution: formQuoteAttribution || 'Atelier Note',
                      },
                    ] as const)
                  : []),
              ],
              interview:
                formType === 'interview'
                  ? {
                      subjectName: formSubjectName || 'Creative Subject',
                      subjectTitle: formSubjectTitle || 'Artistic Director',
                      intro: formDek,
                      portrait: {
                        url: formCoverUrl,
                        alt: formSubjectName,
                      },
                      keyQuote: formKeyQuote || formQuote || 'True luxury is standing alone with an idea.',
                      qas: art.interview?.qas || [
                        {
                          speaker: 'ÉLAN',
                          question: 'How do you describe your current creative phase?',
                          answer: 'Uncompromising and deliberate. We seek absolute truth in form.',
                        },
                      ],
                    }
                  : undefined,
            };
          }
          return art;
        })
      );
      showToast(`Updated "${formTitle}" successfully.`);
    } else {
      // Create new
      const newArticle: Article = {
        id: `dispatch-${Date.now()}`,
        slug: slug || `dispatch-${Date.now()}`,
        title: formTitle,
        dek: formDek,
        category: formCategory,
        categoryLabel: categoryObj?.label || 'Dispatch',
        tags: updatedTags.length > 0 ? updatedTags : ['Dispatch', 'Culture'],
        author: authorObj,
        publishedAt: new Date().toISOString(),
        dateFormatted: new Intl.DateTimeFormat('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }).format(new Date()),
        readTime: formReadTime,
        type: formType,
        coverImage: {
          url:
            formCoverUrl ||
            'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=85&w=1600',
          alt: formTitle,
          caption: formCoverCaption,
          credit: 'ÉLAN Editorial Archive',
          aspectRatio: 'landscape',
        },
        content: [
          { type: 'paragraph', text: formParagraph1, dropCap: true },
          ...(formQuote
            ? ([
                {
                  type: 'quote',
                  quote: formQuote,
                  attribution: formQuoteAttribution || 'Editorial Voice',
                },
              ] as const)
            : []),
        ],
        interview:
          formType === 'interview'
            ? {
                subjectName: formSubjectName || 'Creative Subject',
                subjectTitle: formSubjectTitle || 'Innovator',
                intro: formDek,
                portrait: {
                  url: formCoverUrl,
                  alt: formSubjectName,
                },
                keyQuote: formKeyQuote || formQuote || 'We do not build for consensus.',
                qas: [
                  {
                    speaker: 'ÉLAN',
                    question: 'What is the guiding principle of your work?',
                    answer: 'A radical devotion to silence, texture, and uncompromising vision.',
                  },
                ],
              }
            : undefined,
        isDevMock: true,
      };

      setArticles((prev) => [newArticle, ...prev]);
      showToast(`Published new story "${formTitle}".`);
    }

    setActiveTab('articles');
  };

  // Delete story
  const handleDeleteStory = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
      showToast(`Deleted "${title}".`);
    }
  };

  // Set story as Lead Feature
  const handleSetLead = (id: string) => {
    setArticles((prev) =>
      prev.map((a) => ({
        ...a,
        isLead: a.id === id,
      }))
    );
    showToast('Updated Lead Cover Story.');
  };

  // Toggle Trending
  const handleToggleTrending = (id: string) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isTrending: !a.isTrending } : a))
    );
    showToast('Updated trending status.');
  };

  // Filtered stories
  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      searchQuery === '' ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || art.category === selectedCategory;

    const matchesType = selectedType === 'all' || art.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const leadStory = articles.find((a) => a.isLead) || articles[0];
  const interviewStories = articles.filter((a) => a.type === 'interview');

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#11100F] font-sans antialiased flex flex-col">
      {/* Top Admin Brand Navigation */}
      <header className="bg-[#11100F] text-[#F5F0E8] border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="font-display text-2xl sm:text-3xl font-bold tracking-[0.14em] text-[#F5F0E8] hover:text-[#C98B9D] transition-colors"
            >
              ÉLAN
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-xs uppercase tracking-[0.22em] text-[#C98B9D] font-mono font-semibold">
              Editorial CMS Desk
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-white/70 hover:text-white hover:underline transition-colors"
            >
              <span>Live Magazine</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            <div className="h-4 w-[1px] bg-white/20" />

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#751F3D] flex items-center justify-center text-xs font-bold text-white font-mono">
                É
              </div>
              <span className="text-xs text-white/90 hidden sm:inline font-medium">
                Editor-in-Chief
              </span>
            </div>
          </div>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8 text-xs uppercase tracking-[0.18em] border-t border-white/10 overflow-x-auto">
          <button
            onClick={() => setActiveTab('articles')}
            className={`py-3.5 font-medium transition-colors border-b-2 ${
              activeTab === 'articles'
                ? 'border-[#751F3D] text-white font-semibold'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            Dispatches ({articles.length})
          </button>
          <button
            onClick={() => {
              if (activeTab !== 'composer') handleOpenNewStory();
            }}
            className={`py-3.5 font-medium transition-colors border-b-2 ${
              activeTab === 'composer'
                ? 'border-[#751F3D] text-white font-semibold'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            {editingArticleId ? 'Edit Dispatch' : 'New Dispatch'}
          </button>
          <button
            onClick={() => setActiveTab('curation')}
            className={`py-3.5 font-medium transition-colors border-b-2 ${
              activeTab === 'curation'
                ? 'border-[#751F3D] text-white font-semibold'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            Homepage Curation
          </button>
          <button
            onClick={() => setActiveTab('authors')}
            className={`py-3.5 font-medium transition-colors border-b-2 ${
              activeTab === 'authors'
                ? 'border-[#751F3D] text-white font-semibold'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            Masthead & Contributors
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 p-4 bg-[#11100F] text-[#F5F0E8] border border-[#751F3D] shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <Check className="w-4 h-4 text-[#C98B9D]" />
            <span className="text-xs uppercase tracking-wider font-medium">{toastMessage}</span>
          </div>
        )}

        {/* =========================================================================
            TAB 1: DISPATCHES (Story Management)
            ========================================================================= */}
        {activeTab === 'articles' && (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#11100F]/12">
              <div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#11100F]">
                  Editorial Dispatches
                </h1>
                <p className="font-reading text-sm text-[#11100F]/70 mt-1">
                  Manage publication stories, assign cover features, and edit metadata.
                </p>
              </div>

              <button
                onClick={handleOpenNewStory}
                className="px-5 py-2.5 bg-[#751F3D] hover:bg-[#8C2549] text-white text-xs uppercase tracking-widest font-semibold flex items-center gap-2 transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>New Dispatch</span>
              </button>
            </div>

            {/* Metrics Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-white/60 border border-[#11100F]/10">
                <span className="text-[10px] uppercase tracking-widest text-[#751F3D] font-mono font-bold block">
                  TOTAL DISPATCHES
                </span>
                <span className="font-display text-3xl font-bold text-[#11100F] mt-1 block">
                  {articles.length}
                </span>
              </div>
              <div className="p-4 bg-white/60 border border-[#11100F]/10">
                <span className="text-[10px] uppercase tracking-widest text-[#751F3D] font-mono font-bold block">
                  LEAD COVER STORY
                </span>
                <span className="font-display text-base font-bold text-[#11100F] mt-1 block line-clamp-1">
                  {leadStory?.title || 'None selected'}
                </span>
              </div>
              <div className="p-4 bg-white/60 border border-[#11100F]/10">
                <span className="text-[10px] uppercase tracking-widest text-[#751F3D] font-mono font-bold block">
                  INTERVIEW SPOTLIGHTS
                </span>
                <span className="font-display text-3xl font-bold text-[#11100F] mt-1 block">
                  {interviewStories.length}
                </span>
              </div>
              <div className="p-4 bg-white/60 border border-[#11100F]/10">
                <span className="text-[10px] uppercase tracking-widest text-[#751F3D] font-mono font-bold block">
                  CATEGORIES ACTIVE
                </span>
                <span className="font-display text-3xl font-bold text-[#11100F] mt-1 block">
                  {CATEGORIES.length}
                </span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 bg-white/70 border border-[#11100F]/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#11100F]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by title, author, or keyword..."
                  className="w-full pl-9 pr-4 py-2 bg-transparent text-sm text-[#11100F] placeholder-[#11100F]/40 border border-[#11100F]/15 focus:outline-none focus:border-[#751F3D]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-[#11100F]/60 font-mono">
                    Category:
                  </span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-[#11100F]/15 text-xs text-[#11100F] focus:outline-none focus:border-[#751F3D]"
                  >
                    <option value="all">All Categories</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-[#11100F]/60 font-mono">
                    Type:
                  </span>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-[#11100F]/15 text-xs text-[#11100F] focus:outline-none focus:border-[#751F3D]"
                  >
                    <option value="all">All Formats</option>
                    <option value="standard">Standard</option>
                    <option value="feature">Feature</option>
                    <option value="interview">Interview</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Articles Table */}
            <div className="bg-white/80 border border-[#11100F]/12 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#11100F]/5 border-b border-[#11100F]/10 text-[10px] uppercase font-mono tracking-widest text-[#11100F]/70">
                    <tr>
                      <th className="py-3 px-4">Story & Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Format</th>
                      <th className="py-3 px-4">Author</th>
                      <th className="py-3 px-4">Status / Role</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#11100F]/8">
                    {filteredArticles.map((art) => (
                      <tr key={art.id} className="hover:bg-[#EAD6D8]/10 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={art.coverImage.url}
                              alt={art.title}
                              className="w-12 h-12 object-cover shrink-0 border border-[#11100F]/10"
                            />
                            <div>
                              <div className="font-display font-bold text-sm text-[#11100F] line-clamp-1">
                                {art.title}
                              </div>
                              <div className="text-[11px] text-[#11100F]/55 line-clamp-1 font-reading">
                                {art.dek}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#751F3D]">
                            {art.categoryLabel}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-xs capitalize text-[#11100F]/70">
                          {art.type}
                        </td>

                        <td className="py-3.5 px-4 text-xs text-[#11100F]/80">
                          {art.author.name}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1.5">
                            {art.isLead && (
                              <span className="px-2 py-0.5 bg-[#751F3D] text-white text-[9px] uppercase font-mono font-bold tracking-wider">
                                Lead Cover
                              </span>
                            )}
                            {art.isTrending && (
                              <span className="px-2 py-0.5 bg-[#C5A46D]/20 text-[#751F3D] border border-[#C5A46D]/40 text-[9px] uppercase font-mono font-bold tracking-wider">
                                Trending
                              </span>
                            )}
                            {art.isEditorPick && (
                              <span className="px-2 py-0.5 bg-white border border-[#11100F]/15 text-[9px] uppercase font-mono text-[#11100F]/70 tracking-wider">
                                Pick
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={
                                art.type === 'interview'
                                  ? `/interview/${art.slug}`
                                  : art.type === 'feature'
                                  ? `/feature/${art.slug}`
                                  : `/article/${art.slug}`
                              }
                              target="_blank"
                              className="p-1.5 text-[#11100F]/60 hover:text-[#751F3D] transition-colors"
                              title="Preview on site"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleSetLead(art.id)}
                              className={`p-1.5 transition-colors ${
                                art.isLead
                                  ? 'text-[#751F3D]'
                                  : 'text-[#11100F]/40 hover:text-[#751F3D]'
                              }`}
                              title={art.isLead ? 'Current Lead Cover' : 'Make Lead Cover Story'}
                            >
                              <Sparkles className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditStory(art)}
                              className="p-1.5 text-[#11100F]/60 hover:text-[#751F3D] transition-colors"
                              title="Edit Story"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteStory(art.id, art.title)}
                              className="p-1.5 text-[#11100F]/40 hover:text-red-700 transition-colors"
                              title="Delete Story"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: EDITORIAL COMPOSER (Create & Edit)
            ========================================================================= */}
        {activeTab === 'composer' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#11100F]/12">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#751F3D] font-mono font-bold block">
                  {editingArticleId ? 'EDITING DISPATCH' : 'NEW EDITORIAL DRAFT'}
                </span>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#11100F]">
                  {editingArticleId ? 'Modify Story Content' : 'Compose New Article'}
                </h1>
              </div>

              <button
                onClick={() => setActiveTab('articles')}
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#11100F]/60 hover:text-[#751F3D] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Cancel & Return</span>
              </button>
            </div>

            <form onSubmit={handleSaveStory} className="space-y-6">
              {/* Story Title & Dek */}
              <div className="p-6 bg-white/70 border border-[#11100F]/12 space-y-4">
                <div>
                  <label className="block text-xs uppercase font-mono tracking-wider text-[#11100F]/70 mb-1">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. The Architecture of Sensation"
                    className="w-full px-4 py-2.5 bg-white border border-[#11100F]/20 font-display text-xl text-[#11100F] focus:outline-none focus:border-[#751F3D]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono tracking-wider text-[#11100F]/70 mb-1">
                    Dek / Subheadline (Summary)
                  </label>
                  <textarea
                    rows={2}
                    value={formDek}
                    onChange={(e) => setFormDek(e.target.value)}
                    placeholder="A poetic, compelling summary that hooks the reader..."
                    className="w-full px-4 py-2 bg-white border border-[#11100F]/20 font-reading text-sm text-[#11100F] focus:outline-none focus:border-[#751F3D]"
                  />
                </div>
              </div>

              {/* Taxonomy & Author Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-white/70 border border-[#11100F]/12">
                  <label className="block text-xs uppercase font-mono tracking-wider text-[#11100F]/70 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as CategorySlug)}
                    className="w-full px-3 py-2 bg-white border border-[#11100F]/20 text-xs text-[#11100F] focus:outline-none focus:border-[#751F3D]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-4 bg-white/70 border border-[#11100F]/12">
                  <label className="block text-xs uppercase font-mono tracking-wider text-[#11100F]/70 mb-1">
                    Format
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-[#11100F]/20 text-xs text-[#11100F] focus:outline-none focus:border-[#751F3D]"
                  >
                    <option value="standard">Standard Article</option>
                    <option value="feature">Feature Essay</option>
                    <option value="interview">Prestige Interview (Q&A)</option>
                  </select>
                </div>

                <div className="p-4 bg-white/70 border border-[#11100F]/12">
                  <label className="block text-xs uppercase font-mono tracking-wider text-[#11100F]/70 mb-1">
                    Contributing Author
                  </label>
                  <select
                    value={formAuthorId}
                    onChange={(e) => setFormAuthorId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#11100F]/20 text-xs text-[#11100F] focus:outline-none focus:border-[#751F3D]"
                  >
                    {Object.values(MOCK_AUTHORS).map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.role.split(' ')[0]})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cover Photography */}
              <div className="p-6 bg-white/70 border border-[#11100F]/12 space-y-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#751F3D]" />
                  <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#11100F]">
                    Cover Photography & Art Direction
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-mono tracking-wider text-[#11100F]/70 mb-1">
                      Image URL (Unsplash or CDN)
                    </label>
                    <input
                      type="url"
                      value={formCoverUrl}
                      onChange={(e) => setFormCoverUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-white border border-[#11100F]/20 text-xs text-[#11100F] focus:outline-none focus:border-[#751F3D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono tracking-wider text-[#11100F]/70 mb-1">
                      Caption / Material Note
                    </label>
                    <input
                      type="text"
                      value={formCoverCaption}
                      onChange={(e) => setFormCoverCaption(e.target.value)}
                      placeholder="e.g. Sculptural silk gazar in natural dawn light."
                      className="w-full px-3 py-2 bg-white border border-[#11100F]/20 text-xs text-[#11100F] focus:outline-none focus:border-[#751F3D]"
                    />
                  </div>
                </div>

                {formCoverUrl && (
                  <div className="pt-2">
                    <span className="block text-[10px] uppercase font-mono text-[#11100F]/50 mb-1">
                      Live Image Preview
                    </span>
                    <img
                      src={formCoverUrl}
                      alt="Cover Preview"
                      className="w-full max-h-56 object-cover border border-[#11100F]/10"
                    />
                  </div>
                )}
              </div>

              {/* Content Body / Pull Quote */}
              <div className="p-6 bg-white/70 border border-[#11100F]/12 space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#751F3D]" />
                  <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#11100F]">
                    Article Narrative & Pull Quotes
                  </span>
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono tracking-wider text-[#11100F]/70 mb-1">
                    Opening Paragraph (Rendered with Élan Wine Drop-cap)
                  </label>
                  <textarea
                    rows={4}
                    value={formParagraph1}
                    onChange={(e) => setFormParagraph1(e.target.value)}
                    placeholder="Opening text that establishes the editorial voice..."
                    className="w-full px-4 py-2.5 bg-white border border-[#11100F]/20 font-reading text-base text-[#11100F] focus:outline-none focus:border-[#751F3D]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-mono tracking-wider text-[#11100F]/70 mb-1">
                      Editorial Pull Quote
                    </label>
                    <input
                      type="text"
                      value={formQuote}
                      onChange={(e) => setFormQuote(e.target.value)}
                      placeholder="&quot;True luxury is standing completely alone...&quot;"
                      className="w-full px-3 py-2 bg-white border border-[#11100F]/20 font-reading italic text-sm text-[#11100F] focus:outline-none focus:border-[#751F3D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-mono tracking-wider text-[#11100F]/70 mb-1">
                      Quote Attribution
                    </label>
                    <input
                      type="text"
                      value={formQuoteAttribution}
                      onChange={(e) => setFormQuoteAttribution(e.target.value)}
                      placeholder="e.g. Elena Vance / Couture Manifesto"
                      className="w-full px-3 py-2 bg-white border border-[#11100F]/20 text-xs text-[#11100F] focus:outline-none focus:border-[#751F3D]"
                    />
                  </div>
                </div>

                {/* If format is Interview, show interview-specific inputs */}
                {formType === 'interview' && (
                  <div className="mt-4 pt-4 border-t border-[#11100F]/10 space-y-4">
                    <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#751F3D] block">
                      PRESTIGE INTERVIEW (Q&A) DETAILS
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase font-mono tracking-wider text-[#11100F]/70 mb-1">
                          Subject Name
                        </label>
                        <input
                          type="text"
                          value={formSubjectName}
                          onChange={(e) => setFormSubjectName(e.target.value)}
                          placeholder="e.g. Elena Vance"
                          className="w-full px-3 py-2 bg-white border border-[#11100F]/20 text-xs text-[#11100F] focus:outline-none focus:border-[#751F3D]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase font-mono tracking-wider text-[#11100F]/70 mb-1">
                          Subject Title
                        </label>
                        <input
                          type="text"
                          value={formSubjectTitle}
                          onChange={(e) => setFormSubjectTitle(e.target.value)}
                          placeholder="e.g. Founder & Artistic Director"
                          className="w-full px-3 py-2 bg-white border border-[#11100F]/20 text-xs text-[#11100F] focus:outline-none focus:border-[#751F3D]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tags & Read Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white/70 border border-[#11100F]/12">
                  <label className="block text-xs uppercase font-mono tracking-wider text-[#11100F]/70 mb-1">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="Couture, Architecture, Paris"
                    className="w-full px-3 py-2 bg-white border border-[#11100F]/20 text-xs text-[#11100F] focus:outline-none focus:border-[#751F3D]"
                  />
                </div>

                <div className="p-4 bg-white/70 border border-[#11100F]/12">
                  <label className="block text-xs uppercase font-mono tracking-wider text-[#11100F]/70 mb-1">
                    Estimated Read Time
                  </label>
                  <input
                    type="text"
                    value={formReadTime}
                    onChange={(e) => setFormReadTime(e.target.value)}
                    placeholder="6 min read"
                    className="w-full px-3 py-2 bg-white border border-[#11100F]/20 text-xs text-[#11100F] focus:outline-none focus:border-[#751F3D]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#11100F]/12">
                <button
                  type="button"
                  onClick={() => setActiveTab('articles')}
                  className="px-5 py-2.5 border border-[#11100F]/20 text-xs uppercase tracking-wider text-[#11100F]/70 hover:text-[#11100F] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#751F3D] hover:bg-[#8C2549] text-white text-xs uppercase tracking-widest font-semibold flex items-center gap-2 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingArticleId ? 'Save Changes' : 'Publish Dispatch'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =========================================================================
            TAB 3: HOMEPAGE CURATION DESK
            ========================================================================= */}
        {activeTab === 'curation' && (
          <div className="space-y-8">
            <div className="pb-4 border-b border-[#11100F]/12">
              <span className="text-[10px] uppercase tracking-widest text-[#751F3D] font-mono font-bold block">
                HOMEPAGE ART DIRECTION & PACING
              </span>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#11100F]">
                Curate Magazine Front Page
              </h1>
              <p className="font-reading text-sm text-[#11100F]/70 mt-1">
                Select which stories occupy the monumental Lead Cover, the Pink Couture Spread, and the NOVA Spotlight Interview.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Lead Story Curator */}
              <div className="lg:col-span-6 p-6 bg-white/70 border border-[#11100F]/12 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#11100F]/10">
                  <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#751F3D]">
                    1. Active Lead Cover Story
                  </span>
                  <span className="text-[10px] font-mono text-[#11100F]/50">
                    HERO POSITION
                  </span>
                </div>

                <div className="space-y-3">
                  <img
                    src={leadStory.coverImage.url}
                    alt={leadStory.title}
                    className="w-full aspect-[16/9] object-cover border border-[#11100F]/15"
                  />
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-[#751F3D] font-semibold">
                      {leadStory.categoryLabel}
                    </span>
                    <h3 className="font-display text-xl font-bold text-[#11100F]">
                      {leadStory.title}
                    </h3>
                    <p className="font-reading text-sm text-[#11100F]/70 line-clamp-2">
                      {leadStory.dek}
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-xs uppercase font-mono tracking-wider text-[#11100F]/70 mb-1">
                    Switch Lead Story to:
                  </label>
                  <select
                    value={leadStory.id}
                    onChange={(e) => handleSetLead(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#11100F]/20 text-xs text-[#11100F] focus:outline-none focus:border-[#751F3D]"
                  >
                    {articles.map((art) => (
                      <option key={art.id} value={art.id}>
                        {art.title} ({art.categoryLabel})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Spotlight Interview Curator */}
              <div className="lg:col-span-6 p-6 bg-[#11100F] text-[#F5F0E8] border border-[#11100F] space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/15">
                  <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#C98B9D]">
                    2. Spotlight Interview Feature
                  </span>
                  <span className="text-[10px] font-mono text-white/40">
                    NOVA DRAMA
                  </span>
                </div>

                {interviewStories[0] ? (
                  <div className="space-y-3">
                    <img
                      src={interviewStories[0].coverImage.url}
                      alt={interviewStories[0].title}
                      className="w-full aspect-[16/9] object-cover border border-white/20"
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-[#C98B9D] font-semibold">
                        {interviewStories[0].interview?.subjectName || 'Feature'}
                      </span>
                      <h3 className="font-display text-xl font-bold text-white">
                        {interviewStories[0].title}
                      </h3>
                      <p className="font-reading text-sm text-white/70 line-clamp-2">
                        &ldquo;{interviewStories[0].interview?.keyQuote}&rdquo;
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-white/50">No interview articles configured.</p>
                )}

                <div className="pt-2">
                  <span className="text-xs text-white/50 block">
                    Interviews are rendered in high-contrast editorial dark-mode with distinct Q&A speaker typography.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: MASTHEAD & CONTRIBUTORS
            ========================================================================= */}
        {activeTab === 'authors' && (
          <div className="space-y-8">
            <div className="pb-4 border-b border-[#11100F]/12">
              <span className="text-[10px] uppercase tracking-widest text-[#751F3D] font-mono font-bold block">
                EDITORIAL MASTHEAD
              </span>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#11100F]">
                Contributing Voices & Editors
              </h1>
              <p className="font-reading text-sm text-[#11100F]/70 mt-1">
                Development mock contributor directory. Easily connected to your database or headless CMS.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.values(MOCK_AUTHORS).map((author) => {
                const authorStoryCount = articles.filter(
                  (a) => a.author.id === author.id
                ).length;

                return (
                  <div
                    key={author.id}
                    className="p-6 bg-white/70 border border-[#11100F]/12 flex items-start gap-4"
                  >
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="w-16 h-16 rounded-full object-cover shrink-0 border border-[#751F3D]/20"
                    />
                    <div className="space-y-1 flex-1">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#751F3D] font-semibold block">
                        {author.role}
                      </span>
                      <h3 className="font-display text-xl font-bold text-[#11100F]">
                        {author.name}
                      </h3>
                      {author.bio && (
                        <p className="font-reading text-xs text-[#11100F]/70 line-clamp-2 pt-1">
                          {author.bio}
                        </p>
                      )}
                      <div className="pt-2 flex items-center justify-between text-xs text-[#11100F]/60">
                        <span>{authorStoryCount} Published Dispatches</span>
                        <Link
                          href={`/author/${author.id}`}
                          target="_blank"
                          className="text-[#751F3D] hover:underline flex items-center gap-1 font-medium"
                        >
                          View Profile <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
