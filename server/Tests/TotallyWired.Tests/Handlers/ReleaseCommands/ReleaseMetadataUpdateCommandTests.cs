using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Moq;
using FluentAssertions;
using MockQueryable.Moq;
using NUnit.Framework;
using TotallyWired.Domain.Entities;
using TotallyWired.Handlers.ReleaseCommands;
using TotallyWired.Models;

namespace TotallyWired.Tests.Handlers.ReleaseCommands;

public class ReleaseMetadataUpdateCommandTests : BaseTestFixture
{
    private ReleaseMetadataUpdateHandler _subject = default!;

    [SetUp]
    protected override void Setup()
    {
        base.Setup();

        _subject = new ReleaseMetadataUpdateHandler(
            MockDbContext.Object,
            MockCurrentUser.Object);
    }

    [Test]
    public async ValueTask ReleaseId_Empty_Should_Return_SuccessFalse()
    {
        // Arrange
        var command = new ReleaseMetadataUpdateCommand
        {
            ReleaseId = Guid.Empty,
            Metadata = new ReleaseMetadataModel()
        };
        
        // Act
        var result = await _subject.HandleAsync(command, default);

        // Assert
        result.Should().NotBeNull();
        result.Success.Should().BeFalse();
        result.Release.Should().BeNull();
        
        MockDbContext.VerifyGet(x => x.Database, Times.Never);
    }
    
    [Test]
    public async ValueTask ReleaseMusicBrainzId_Empty_Should_Return_SuccessFalse()
    {
        // Arrange
        var releaseId = Guid.NewGuid();
        
        var command = new ReleaseMetadataUpdateCommand
        {
            ReleaseId = releaseId,
            Metadata = new ReleaseMetadataModel
            {
                ReleaseId = releaseId,
                ReleaseMbid = string.Empty,
                ArtistMbid = Guid.NewGuid().ToString()
            }
        };
        
        // Act
        var result = await _subject.HandleAsync(command, default);

        // Assert
        result.Should().NotBeNull();
        result.Success.Should().BeFalse();
        result.Release.Should().BeNull();
        
        MockDbContext.VerifyGet(x => x.Database, Times.Never);
    }
    
    [Test]
    public async ValueTask ReleaseArtistMusicBrainzId_Empty_Should_Return_SuccessFalse()
    {
        // Arrange
        var releaseId = Guid.NewGuid();
        
        var command = new ReleaseMetadataUpdateCommand
        {
            ReleaseId = releaseId,
            Metadata = new ReleaseMetadataModel
            {
                ReleaseId = releaseId,
                ReleaseMbid = Guid.NewGuid().ToString(),
                ArtistMbid = string.Empty
            }
        };
        
        // Act
        var result = await _subject.HandleAsync(command, default);

        // Assert
        result.Should().NotBeNull();
        result.Success.Should().BeFalse();
        result.Release.Should().BeNull();
        
        MockDbContext.VerifyGet(x => x.Database, Times.Never);
    }
    
    [Test]
    public async ValueTask ValidCommand_Release_DoesNotExist_Should_Return_SuccessFalse()
    {
        // Arrange
        var releaseId = Guid.NewGuid();
        
        var command = new ReleaseMetadataUpdateCommand
        {
            ReleaseId = releaseId,
            Metadata = new ReleaseMetadataModel
            {
                ReleaseId = releaseId,
                ReleaseMbid = Guid.NewGuid().ToString(),
                ArtistMbid = Guid.NewGuid().ToString()
            }
        };
        
        // Act
        var result = await _subject.HandleAsync(command, default);

        // Assert
        result.Should().NotBeNull();
        result.Success.Should().BeFalse();
        result.Release.Should().BeNull();
        
        MockDbContext.VerifyGet(x => x.Database, Times.AtLeastOnce);
    }
    
    [Test]
    public async ValueTask ReleaseWithMusicBrainzId_Exists_Should_Return_SuccessTrue_And_ExpectedExistingRelease()
    {
        // Arrange
        var artist = new Artist
        {
            Id = Guid.NewGuid(),
            UserId = CurrentUser.Id,
            MusicBrainzId = Guid.NewGuid().ToString()
        };
        
        var release = new Release
        {
            Id = Guid.NewGuid(),
            UserId = CurrentUser.Id,
            MusicBrainzId = Guid.NewGuid().ToString(),
            ArtistId = artist.Id,
            Artist = artist
        };
        
        var command = new ReleaseMetadataUpdateCommand
        {
            ReleaseId = release.Id,
            Metadata = new ReleaseMetadataModel
            {
                ReleaseId = release.Id,
                ReleaseMbid = release.MusicBrainzId,
                ArtistMbid = artist.MusicBrainzId,
                Tracks = Array.Empty<TrackMetadataModel>()
            }
        };

        var mockReleases = new[] { release }.AsQueryable().BuildMockDbSet();
        
        MockDbContext
            .Setup(x => x.Releases)
            .Returns(mockReleases.Object);
        
        // Act
        var result = await _subject.HandleAsync(command, default);

        // Assert
        result.Should().NotBeNull();
        result.Success.Should().BeTrue();
        result.Release.Should().NotBeNull();
        result.Release.Should().Be(release);
        result.Release!.Artist.Should().Be(artist);
        
        MockDbContext
            .Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.AtLeastOnce);
    }
    
    [Test]
    public async ValueTask ReleaseWithReleaseId_Exists_Should_Return_SuccessTrue_And_ExpectedExistingRelease()
    {
        // Arrange
        var artist = new Artist
        {
            Id = Guid.NewGuid(),
            UserId = CurrentUser.Id,
            MusicBrainzId = string.Empty
        };
        
        var release = new Release
        {
            Id = Guid.NewGuid(),
            UserId = CurrentUser.Id,
            MusicBrainzId = string.Empty,
            ArtistId = artist.Id,
            Artist = artist
        };
        
        var command = new ReleaseMetadataUpdateCommand
        {
            ReleaseId = release.Id,
            Metadata = new ReleaseMetadataModel
            {
                ReleaseId = release.Id,
                ReleaseMbid = Guid.NewGuid().ToString(),
                ArtistMbid = Guid.NewGuid().ToString(),
                Tracks = Array.Empty<TrackMetadataModel>()
            }
        };

        var mockReleases = new[] { release }.AsQueryable().BuildMockDbSet();
        
        MockDbContext
            .Setup(x => x.Releases)
            .Returns(mockReleases.Object);
        
        // Act
        var result = await _subject.HandleAsync(command, default);

        // Assert
        result.Should().NotBeNull();
        result.Success.Should().BeTrue();
        result.Release.Should().NotBeNull();
        result.Release.Should().Be(release);
        result.Release!.Artist.Should().Be(artist);
        
        MockDbContext
            .Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.AtLeastOnce);
    }
    
    [Test]
    public async ValueTask ReleaseWithReleaseIdAndMusicBrainzId_AlreadyExists_Should_Return_SuccessTrue_And_ExpectedNewRelease()
    {
        // Arrange
        var artist = new Artist
        {
            Id = Guid.NewGuid(),
            UserId = CurrentUser.Id,
            MusicBrainzId = Guid.NewGuid().ToString()
        };
        
        var release = new Release
        {
            Id = Guid.NewGuid(),
            UserId = CurrentUser.Id,
            MusicBrainzId = Guid.NewGuid().ToString(),
            ArtistId = artist.Id,
            Artist = artist
        };
        
        var command = new ReleaseMetadataUpdateCommand
        {
            ReleaseId = release.Id,
            Metadata = new ReleaseMetadataModel
            {
                ReleaseId = release.Id,
                ReleaseMbid = Guid.NewGuid().ToString(),
                ArtistMbid = Guid.NewGuid().ToString(),
                Tracks = Array.Empty<TrackMetadataModel>()
            }
        };

        var mockReleases = new[] { release }.AsQueryable().BuildMockDbSet();
        
        MockDbContext
            .Setup(x => x.Releases)
            .Returns(mockReleases.Object);
        
        // Act
        var result = await _subject.HandleAsync(command, default);

        // Assert
        result.Should().NotBeNull();
        result.Success.Should().BeTrue();
        result.Release.Should().NotBeNull();
        result.Release.Should().NotBe(release);
        result.Release!.Artist.Should().NotBe(artist);

        result.Release.MusicBrainzId.Should().Be(command.Metadata.ReleaseMbid);
        result.Release.Artist.MusicBrainzId.Should().Be(command.Metadata.ArtistMbid);
        
        MockDbContext
            .Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.AtLeastOnce);
    }
}