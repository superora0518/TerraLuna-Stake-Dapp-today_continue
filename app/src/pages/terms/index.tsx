import { Footer } from 'components/Footer';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import Markdown from 'react-markdown';
import styled from 'styled-components';
import tos1 from './assets/tos1.md?raw';
import tos2 from './assets/tos2.md?raw';
import { Section } from '@libs/neumorphism-ui/components/Section';
import {PaddedLayout} from 'components/layouts/PaddedLayout';
export interface TermsOfServiceProps {
  className?: string;
}

function TermsOfServiceBase({ className }: TermsOfServiceProps) {
  return (
  <PaddedLayout>
    <Section className={className}>
      <section className="header1">
        <h1 className="title">Terms of Service</h1>
        <Markdown children={tos1} components={{ em: 'u' }} />
      </section>

      <section>
        <Markdown children={tos2} components={{ em: 'u' }} />
        <Footer style={{ margin: '100px 0' }} />
      </section>
    </Section>
  </PaddedLayout>
  );
}

export const StyledTermsOfService = styled(TermsOfServiceBase)`
  font-size: 14px;

  section {
    padding: 5.71428571em 100px;

    p {
      line-height: 1.5;

      &:not(:last-child) {
        margin-bottom: 2em;
      }
    }

    ul {
      line-height: 1.5;

      li {
        margin: 1em 0;
      }
    }

    h3 {
      margin: 4.28571429em 0 1.42857143em 0;

      &:first-child {
        margin-top: 0;
      }
    }
  }
    .header1 {
    > h1:nth-child(1) {
      margin-bottom: 12px;
    }
    > h2:nth-child(2) {
      font-size: 1.42857143em;
      margin-bottom: 2.95em;
    }
  }


  h1.title {
    font-weight: 900;
    font-size: 3.14285714em;
    line-height: 1.2;
    letter-spacing: -0.3px;
  }

  @media (max-width: 950px) {
    font-size: 12px;

    section {
      padding: 50px 40px;
    }

    ul {
      padding-left: 1.5em;
    }
  }

  @media (max-width: 400px) {
    font-size: 12px;

    section {
      padding: 30px 20px;
    }
  }
`;

export const TermsOfService = fixHMR(StyledTermsOfService);