# Wellbeing Evaluation Framework

A comprehensive framework for assessing design's impact on human wellbeing across multiple dimensions and methods.

## Evaluation Levels

### Level 1: Feature-Level Assessment (Quick, Ongoing)

**Timeline**: During design/development
**Method**: Design checklist against Desmet's 13 needs

#### Checklist

For each feature, ask:

- **Autonomy**: Can users control this? Is there transparency about how it works? Can they opt-out?
- **Competence**: Does it help users succeed or overwhelm them? Is feedback clear?
- **Relatedness**: Does it enable genuine connection or performative interaction?
- **Pleasure**: Does it delight appropriately for context, or add clutter?
- **Comfort**: Does it reduce friction or create unnecessary burden?
- **Stimulation**: Is there appropriate challenge and novelty?
- **Self-expression**: Can users express their authentic identity?
- **Self-development**: Does it enable learning and growth?
- **Purpose**: Is connection to meaningful outcome clear?
- **Benevolence**: Can users help others through this feature?
- **Justice**: Is it fair and equitable in access and benefit?
- **Self-care**: Does it support healthy boundaries?
- **Spiritual**: Does it offer moments of transcendence or connection to something larger?

**Scoring**:
- ✓ Feature explicitly supports this need
- ~ Feature neutral or unclear
- ✗ Feature frustrates this need
- ! Unintended negative consequence

**Output**: Feature audit showing wellbeing profile; identify adjustments

### Level 2: Experience-Level Evaluation (In-depth, Sprint cycles)

**Timeline**: After feature completion or major update
**Method**: Mixed-methods combining observation, interview, and measurement

#### Activities

1. **Participant Testing** (6-8 users, 60 min each)
   - Task completion with think-aloud
   - Video observation of behavior and affect
   - Post-task semi-structured interview
   - Immediate SPANE wellbeing scale

2. **Experiential Mapping**
   - Participants create journey map of their experience
   - Emotional highs/lows plotted
   - Touchpoints where each of Desmet's needs affected

3. **Qualitative Analysis**
   - Code interviews for need satisfaction/frustration
   - Identify emotional patterns
   - Note divergence from designer intent

4. **Wellbeing Measurement**
   - PERMA-Profiler or SPANE pre/post
   - Specific questions about autonomy, competence, relatedness impact
   - Calculate effect sizes

#### Deliverables
- Updated persona/user journey with wellbeing dimension
- Specific design adjustments informed by findings
- Measurement data documenting wellbeing impact
- Recommendations for next iteration

### Level 3: Product-Level Evaluation (Summative, Launch readiness)

**Timeline**: Before public release or major deployment
**Method**: Comprehensive mixed-methods study combining all approaches

#### Study Design

**Participants**: 15-25 representative users
**Duration**: 2-4 weeks extended use
**Control**: Pre-post design with waitlist control group (if ethical/feasible)

#### Data Collection

1. **Baseline** (Week 0)
   - Demographics and existing wellbeing (PERMA, SWLS, PWB)
   - Current experience with alternative solutions
   - Values and needs relevant to design

2. **Experience Sampling** (Week 1-3)
   - Daily brief surveys (3 min, via app/SMS)
   - What activities did you do with product?
   - How did you feel: energized, frustrated, connected, lonely, purposeful?
   - Any unexpected consequences?

3. **Qualitative Interviews** (Week 2)
   - Individual: 30-45 min semi-structured
   - Lived experience with product
   - Emotional impacts
   - Value alignment

4. **Usability & Functionality** (Week 2-3)
   - Task completion rates
   - Error frequency
   - Help/support needed
   - System Usability Scale (SUS)

5. **Endpoint** (Week 4)
   - Repeat wellbeing scales (PERMA, SWLS, PWB)
   - Behavioral data (feature usage, engagement)
   - Net Promoter Score (NPS) and feedback
   - Would recommend to others? Why/why not?

#### Analysis & Interpretation

**Quantitative**:
- Change scores (pre-post) on wellbeing measures
- t-tests comparing treatment vs. waitlist
- Effect sizes (Cohen's d)
- Correlation with product engagement

**Qualitative**:
- Thematic analysis of interviews coded to Desmet's needs
- Emotional trajectory narratives
- Unintended consequences identification
- Value alignment assessment

**Mixed-Methods Integration**:
- Do quantitative gains match qualitative lived experience?
- Which wellbeing dimensions improved? Which lagged?
- Who benefited most? Who experienced harm?
- What mechanisms explain wellbeing changes?

#### Decision Framework

**Go/No-Go Criteria**:
- [ ] Statistically significant improvement in primary wellbeing measure
- [ ] Clinically meaningful effect size (d ≥ 0.5)
- [ ] ≥80% participants report positive experience
- [ ] No significant harm documented for any subgroup
- [ ] Task completion ≥90%
- [ ] SUS score ≥70

**Conditional Go**:
- Positive wellbeing outcomes but with identified adjustments needed
- Plan iteration focused on specific needs frustration
- Launch with monitoring and rapid refinement capability

**Hold/No-Go**:
- Neutral or negative wellbeing impact
- Significant usability barriers
- Equity/justice concerns
- Values misalignment
- Return to design phase

### Level 4: Real-World Longitudinal Evaluation (Ongoing, Post-launch)

**Timeline**: 3-12 months after launch
**Method**: In-the-wild data collection with population segment

#### Monitoring Approach

**Passive Monitoring**:
- Feature usage analytics
- Support tickets and user feedback themes
- Retention and engagement metrics
- Technical performance

**Active Monitoring** (monthly):
- Brief NPS/satisfaction questions (1-2 items)
- Qualitative feedback on wellbeing impact
- Adverse event reporting

**Periodic Deep Dives** (quarterly):
- Extended interviews with diverse user segment (10-15 users)
- Wellbeing measures (PERMA or SPANE)
- Journey mapping to identify emerging patterns
- Exploration of cultural/contextual variations

#### Early Warning Signs

Watch for:
- Increasing support requests for same issues
- Sudden engagement drops
- Negative user comments about emotional impact
- Usage patterns suggesting dependency
- Certain user groups disengaging

#### Adaptive Response

**If wellbeing impact declining**:
- Immediate investigation with qualitative interviews
- Root cause analysis (feature behavior, user expectations, external factors)
- Rapid prototype and test potential solutions
- Transparent communication with users about adjustments

**If unintended consequences emerging**:
- Document and prioritize impact severity
- Engage affected communities in solution design
- Communicate changes transparently
- Monitor for effectiveness of adaptations

**If cultural/equity gaps evident**:
- Investigate whether design serves all groups equally
- Co-design adaptations with underserved communities
- Test modifications for inclusivity
- Document and share learnings

## Integration with Business Metrics

Wellbeing evaluation complements but doesn't replace standard metrics:

| **Business Metric** | **Wellbeing Dimension** | **Alignment Check** |
|-------------------|----------------------|-------------------|
| Engagement | Stimulation, Competence | Does high engagement reflect genuine interest or addictive design? |
| Retention | Relatedness, Purpose | Are users staying because of value or because it's hard to leave? |
| Conversion | Autonomy, Justice | Does conversion pressure undermine user agency or fairness? |
| Revenue | Pleasure, Justice | Does monetization model feel fair or exploitative? |
| Growth | Competence, Purpose | Does growth serve user wellbeing or override other considerations? |
| Support Costs | Comfort, Competence | Are high support needs indicating design friction? |

**Ideal State**: Business success and wellbeing outcomes reinforce each other, not compete.

## Measurement Tools Summary

### Quick Measures (2-3 min)
- **SPANE**: 6-item emotional wellbeing
- **SWLS**: 5-item life satisfaction
- **NPS**: 1-item recommendation likelihood

### Comprehensive Measures (10-15 min)
- **PERMA-Profiler**: 23-item multidimensional
- **PWB-18**: 18-item psychological wellbeing
- **PWI-8**: 8-item life satisfaction domains

### Specific Dimensions (5 min each)
- **Autonomy**: 3-item perceived agency
- **Competence**: 3-item effectiveness
- **Relatedness**: 3-item social connection
- **Meaning**: 5-item purpose (MLQ)

## Reporting & Communication

### For Design Teams
- Wellbeing audit results with visual profile
- Specific recommendations prioritized by need impact
- Before/after comparison of design iterations
- Emotional journey maps showing improvement areas

### For Stakeholders/Executives
- Summary: Did wellbeing improve? By how much?
- Business impact: Did wellbeing improvements drive engagement/retention?
- Risk assessment: Any harms to monitor?
- Roadmap: What's next to improve wellbeing?

### For Users
- Transparent communication: How we measure wellbeing
- Summary of findings: What we learned from research
- How feedback shaped design: Specific examples
- Invitation to ongoing participation: Ways to stay involved

### For Regulators/Ethics Bodies
- Methodology documentation
- Statistical analysis and effect sizes
- Subgroup analysis (equity check)
- Adverse event reporting
- Commitments to ongoing monitoring

## Ethics & Safeguards

- **No Coercion**: Research participation fully voluntary
- **Transparency**: Clear about data use and findings dissemination
- **Psychological Safety**: Monitoring for emotional harm; resources available
- **Privacy**: Protect participant identities; aggregate findings
- **Equitable Benefits**: Findings benefit broader community, not just company
- **Honest Reporting**: Share negative findings, not just successes
- **Ongoing Accountability**: Regular public reporting of wellbeing metrics

## Common Pitfalls to Avoid

1. **Measuring only engagement**: High engagement ≠ wellbeing
2. **Ignoring power dynamics**: Users may feel pressure to report positively
3. **Cherry-picking metrics**: Present full picture, inconvenient findings included
4. **Comparing to wrong baseline**: Compare to alternative experiences, not nothing
5. **Treating wellbeing as afterthought**: Evaluate at every phase, not just launch
6. **Individual focus only**: Assess collective/social wellbeing too
7. **Ignoring unintended consequences**: Actively seek harmful impacts
8. **One-time evaluation**: Wellbeing evolves; monitor longitudinally

## Resources

- **Validated Instruments**: Open Science Framework, International Wellbeing Group
- **Design Evaluation**: Nielsen Norman Group, NN/g methods
- **Qualitative Analysis**: Braun & Clarke thematic analysis, ATLAS.ti software
- **Mixed Methods**: Creswell & Plano Clark
- **Wellbeing Science**: Lyubomirsky & others, Journal of Positive Psychology
