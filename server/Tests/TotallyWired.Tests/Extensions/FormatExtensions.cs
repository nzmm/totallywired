using System;
using FluentAssertions;
using NUnit.Framework;
using TotallyWired.Extensions;

namespace TotallyWired.Tests.Extensions;

public class FormatExtensionsTests
{
    [SetUp]
    public void Setup()
    {
    }

    [TestCase(900, "0:00")]
    [TestCase(33_000, "0:33")]
    [TestCase(122_000, "2:02")]
    [TestCase(274_625, "4:34")]
    [TestCase(2_520_000, "42:00")]
    [TestCase(6_112_292, "1:41:52")]
    [TestCase(345_600_000, "96:00:00")]
    public void DisplayDuration_Should_Return_Expected_String(long durationMs, string expectedString)
    {
        // Act
        var result = TimeSpan.FromMilliseconds(durationMs).DisplayDuration();
        
        // Assert
        result.Should().Be(expectedString);
    }
}