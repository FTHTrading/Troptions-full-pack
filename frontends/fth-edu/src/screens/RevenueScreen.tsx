import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PRODUCTS, stripePayments } from '../payment/StripePayments';

export default function RevenueScreen() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);

  const renderProductCard = (key: string, product: any) => (
    <TouchableOpacity
      key={key}
      style={[
        styles.productCard,
        selectedProduct === key && styles.productCardSelected,
      ]}
      onPress={() => setSelectedProduct(key)}
    >
      <LinearGradient
        colors={key.includes('WC26') ? ['#ff6b6b', '#ffd93d'] : ['#1a1a2e', '#16213e']}
        style={styles.productGradient}
      >
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>${product.price}/{product.interval}</Text>
        <Text style={styles.productDesc}>{product.description}</Text>
        
        {product.features.map((feature: string, i: number) => (
          <View key={i} style={styles.featureRow}>
            <Text style={styles.featureCheck}>✓</Text>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
        
        <TouchableOpacity style={styles.subscribeButton}>
          <Text style={styles.subscribeText}>
            {product.interval === 'one_time' ? 'Purchase' : 'Subscribe'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderRevenueStreams = () => (
    <View style={styles.streamsSection}>
      <Text style={styles.streamsTitle}>🚀 FASTEST PATH TO REVENUE</Text>
      
      <View style={styles.streamCard}>
        <Text style={styles.streamEmoji}>💰</Text>
        <View style={styles.streamInfo}>
          <Text style={styles.streamName}>Transfer Fees</Text>
          <Text style={styles.streamDesc}>0.25-1% on every TROPTIONS send</Text>
          <Text style={styles.streamPotential}>Potential: $300K/year</Text>
        </View>
        <Switch value={true} disabled />
      </View>
      
      <View style={styles.streamCard}>
        <Text style={styles.streamEmoji}>🔄</Text>
        <View style={styles.streamInfo}>
          <Text style={styles.streamName}>AMM LP Fees</Text>
          <Text style={styles.streamDesc}>0.3% per trade in pools</Text>
          <Text style={styles.streamPotential}>Potential: $120K/year</Text>
        </View>
        <Switch value={true} disabled />
      </View>
      
      <View style={styles.streamCard}>
        <Text style={styles.streamEmoji}>📚</Text>
        <View style={styles.streamInfo}>
          <Text style={styles.streamName}>Course Subscriptions</Text>
          <Text style={styles.streamDesc}>$9.99-$299.99/month</Text>
          <Text style={styles.streamPotential}>Potential: $50K/month</Text>
        </View>
        <Switch value={isPro} onValueChange={setIsPro} />
      </View>
      
      <View style={styles.streamCard}>
        <Text style={styles.streamEmoji}>⚽</Text>
        <View style={styles.streamInfo}>
          <Text style={styles.streamName}>WC2026 Sponsors</Text>
          <Text style={styles.streamDesc}>$500-$10,000 per sponsor</Text>
          <Text style={styles.streamPotential}>Potential: $100K+ (6 matches)</Text>
        </View>
        <Switch value={true} disabled />
      </View>
      
      <View style={styles.streamCard}>
        <Text style={styles.streamEmoji}>🎨</Text>
        <View style={styles.streamInfo}>
          <Text style={styles.streamName}>NFT Sales</Text>
          <Text style={styles.streamDesc}>0.05-0.5 SOL per NFT</Text>
          <Text style={styles.streamPotential}>Potential: $25K/month</Text>
        </View>
        <Switch value={true} disabled />
      </View>
    </View>
  );

  const renderActionPlan = () => (
    <View style={styles.actionSection}>
      <Text style={styles.actionTitle}>⚡ IMMEDIATE ACTION PLAN</Text>
      
      <View style={styles.actionStep}>
        <Text style={styles.stepNumber}>1</Text>
        <View style={styles.stepContent}>
          <Text style={styles.stepName}>Fund Issuer Wallet</Text>
          <Text style={styles.stepDetail}>Move 10 XRP to rJLMST... to enable tokens</Text>
          <Text style={styles.stepStatus}>⏳ BLOCKED — Need your seed</Text>
        </View>
      </View>
      
      <View style={styles.actionStep}>
        <Text style={styles.stepNumber}>2</Text>
        <View style={styles.stepContent}>
          <Text style={styles.stepName}>Connect Stripe</Text>
          <Text style={styles.stepDetail}>Add your live Stripe keys to .env</Text>
          <Text style={styles.stepStatus}>⏳ READY — Add keys to enable</Text>
        </View>
      </View>
      
      <View style={styles.actionStep}>
        <Text style={styles.stepNumber}>3</Text>
        <View style={styles.stepContent}>
          <Text style={styles.stepName}>Deploy App to Stores</Text>
          <Text style={styles.stepDetail}>Build with EAS, submit to Apple/Google</Text>
          <Text style={styles.stepStatus}>✅ READY — LAUNCH-T-EDU-AI.cmd</Text>
        </View>
      </View>
      
      <View style={styles.actionStep}>
        <Text style={styles.stepNumber}>4</Text>
        <View style={styles.stepContent}>
          <Text style={styles.stepName}>Launch WC2026 Campaign</Text>
          <Text style={styles.stepDetail}>Contact Atlanta vendors for sponsorships</Text>
          <Text style={styles.stepStatus}>✅ READY — Use MERCHANT_ONE_PAGER.md</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#0a0a0f', '#1a0a2e']} style={styles.header}>
        <Text style={styles.headerEmoji}>💰</Text>
        <Text style={styles.headerTitle}>REVENUE CENTER</Text>
        <Text style={styles.headerSubtitle}>TROPTIONS — 22 Years Strong</Text>
      </LinearGradient>

      {renderRevenueStreams()}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📦 SUBSCRIPTION PLANS</Text>
        {Object.entries(PRODUCTS).map(([key, product]) => renderProductCard(key, product))}
      </View>

      {renderActionPlan()}

      <View style={styles.totalSection}>
        <Text style={styles.totalLabel}>Total Revenue Potential</Text>
        <Text style={styles.totalAmount}>$660K+ / Year</Text>
        <Text style={styles.totalNote}>With $100K daily trading volume</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  header: {
    padding: 24,
    alignItems: 'center',
    paddingTop: 60,
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    color: '#00ff88',
    marginTop: 4,
    fontSize: 14,
  },
  streamsSection: {
    padding: 20,
  },
  streamsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: 16,
  },
  streamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  streamEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  streamInfo: {
    flex: 1,
  },
  streamName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  streamDesc: {
    color: '#888888',
    fontSize: 13,
    marginTop: 2,
  },
  streamPotential: {
    color: '#00ff88',
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  productCard: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  productCardSelected: {
    borderWidth: 2,
    borderColor: '#00ff88',
  },
  productGradient: {
    padding: 20,
  },
  productName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    color: '#00ff88',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  productDesc: {
    color: '#888888',
    fontSize: 13,
    marginTop: 4,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  featureCheck: {
    color: '#00ff88',
    marginRight: 8,
  },
  featureText: {
    color: '#aaaaaa',
    fontSize: 13,
  },
  subscribeButton: {
    backgroundColor: '#00ff88',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  subscribeText: {
    color: '#0a0a0f',
    fontWeight: 'bold',
    fontSize: 14,
  },
  actionSection: {
    padding: 20,
  },
  actionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffd93d',
    marginBottom: 16,
  },
  actionStep: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00ff88',
    color: '#0a0a0f',
    textAlign: 'center',
    lineHeight: 32,
    fontWeight: 'bold',
    marginRight: 12,
  },
  stepContent: {
    flex: 1,
  },
  stepName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  stepDetail: {
    color: '#888888',
    fontSize: 13,
    marginTop: 2,
  },
  stepStatus: {
    color: '#ffd93d',
    fontSize: 12,
    marginTop: 4,
  },
  totalSection: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 40,
  },
  totalLabel: {
    color: '#888888',
    fontSize: 14,
  },
  totalAmount: {
    color: '#00ff88',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 8,
  },
  totalNote: {
    color: '#666666',
    fontSize: 12,
    marginTop: 4,
  },
});
